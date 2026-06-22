const {
  callOpenRouterChat,
  extractContent,
} = require("../utils/openrouter.service");

const {
  parseJsonObject,
} = require("../utils/aiJson");

const MODEL =
  "openai/gpt-oss-120b:free";

function clampNumber(
  value,
  min,
  max,
  fallback
) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed))
    return fallback;

  return Math.min(
    max,
    Math.max(min, Math.round(parsed))
  );
}

function truncateWords(
  text,
  maxWords
) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length <= maxWords)
    return words.join(" ");

  return `${words
    .slice(0, maxWords)
    .join(" ")}...`;
}

function normalizeText(
  value,
  fallback = ""
) {
  const text = String(
    value || fallback
  )
    .replace(/```/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
}

function normalizeThreatLevel(
  value,
  riskScore
) {
  const allowed = [
    "Low",
    "Medium",
    "High",
    "Critical",
  ];

  if (allowed.includes(value))
    return value;

  const score = Number(riskScore) || 50;
  if (score >= 81) return "Critical";
  if (score >= 61) return "High";
  if (score >= 41) return "Medium";
  return "Low";
}

function normalizeForecast(
  forecast,
  riskScore
) {
  const safeForecast =
    forecast &&
    typeof forecast === "object"
      ? forecast
      : {};
  const score = clampNumber(
    riskScore,
    0,
    100,
    50
  );

  let escalation = clampNumber(
    safeForecast.escalation,
    0,
    100,
    Math.max(
      0,
      Math.min(
        100,
        Math.round(score * 0.6)
      )
    )
  );

  let stability = clampNumber(
    safeForecast.stability,
    0,
    100,
    Math.max(
      0,
      Math.min(100, 100 - score)
    )
  );

  let deEscalation = clampNumber(
    safeForecast.deEscalation,
    0,
    100,
    Math.max(
      0,
      Math.min(
        100,
        100 - escalation - stability
      )
    )
  );

  const total =
    escalation +
    stability +
    deEscalation;

  if (total !== 100) {
    const scale =
      100 / Math.max(1, total);
    escalation = Math.round(
      escalation * scale
    );
    stability = Math.round(
      stability * scale
    );
    deEscalation = Math.max(
      0,
      100 - escalation - stability
    );
  }

  return {
    escalation,
    stability,
    deEscalation,
  };
}

function buildRegionPayload(
  region,
  news,
  conflicts
) {
  return {
    name: region.name,
    currentRiskScore:
      Number(region.riskScore) || 50,
    currentActiveConflicts:
      Number(region.activeConflicts) ||
      0,
    currentThreatLevel:
      region.threatLevel || "Low",
    currentSummary:
      region.summary || "",
    headlines: (news || [])
      .slice(0, 3)
      .map((article) => ({
        title: normalizeText(
          article.title,
          ""
        ),
        description: truncateWords(
          normalizeText(
            article.description ||
              article.content ||
              "",
            ""
          ),
          12
        ),
        source: normalizeText(
          article.source || "",
          ""
        ),
        publishedAt:
          article.publishedAt ||
          article.publish_date ||
          article.pubDate ||
          null,
      })),
    conflicts: (conflicts || [])
      .slice(0, 5)
      .map((conflict) => ({
        name: normalizeText(
          conflict.name,
          ""
        ),
        severity:
          conflict.severity || "Medium",
        status:
          conflict.status ||
          "Monitoring",
        summary: truncateWords(
          normalizeText(
            conflict.summary || "",
            ""
          ),
          20
        ),
      })),
  };
}

function buildPrompt(
  regionsPayload
) {
  return `
You are a senior geopolitical intelligence analyst.

Analyze the following regional news packets and conflict context and return a single JSON object.
Use the exact region names from the input.
Do not invent regions.
Do not use markdown or code fences.
Output JSON only.

Important:
- Use both the recent headlines and the supplied conflict context.
- If conflict context exists for a region, it should materially influence riskScore, activeConflicts, threatLevel, forecast, and assessment.
- If a region has little or no news, keep the score conservative unless active conflict context clearly indicates otherwise.

For each region, return:
{
  "riskScore": 0-100,
  "activeConflicts": 0,
  "forecast": {
    "escalation": 0,
    "stability": 0,
    "deEscalation": 0
  },
  "summary": "max 50 words",
  "threatLevel": "Low | Medium | High | Critical",
  "assessment": "max 100 words"
}

Rules:
- riskScore must be a NUMBER.
- activeConflicts must be a NUMBER.
- forecast values must total 100.
- assessment should sound like a professional intelligence brief.
- Keep language concise, specific, and analytical.
- Use current conflict context to avoid downplaying active wars or escalations.

Risk Score Framework

0-20 = Stable
21-40 = Low Risk
41-60 = Moderate Risk
61-75 = Elevated Risk
76-85 = High Risk
86-100 = Extreme Risk

Only use scores above 85 when:
- Multiple active interstate wars exist
- Large-scale military operations are ongoing
- Significant regional escalation is underway

Most regions should fall between 30 and 70.
Avoid assigning extreme values unless strongly justified.

Input JSON:
${JSON.stringify({
  regions: regionsPayload,
})}

Return only this shape:
{
  "regions": {
    "North America": {
      "riskScore": 0,
      "activeConflicts": 0,
      "forecast": {
        "escalation": 0,
        "stability": 0,
        "deEscalation": 0
      },
      "summary": "",
      "threatLevel": "Low",
      "assessment": ""
    }
  }
}
`;
}

function applyFineGrainAdjustment(
  score,
  region,
  payload
) {
  if (
    score <= 0 ||
    score >= 100 ||
    score % 5 !== 0
  ) {
    return score;
  }

  const headlineCount =
    payload?.headlines?.length || 0;
  const conflictCount =
    payload?.conflicts?.length || 0;

  const seed =
    (String(region.name).length +
      headlineCount * 3 +
      conflictCount * 7) %
    4;

  const deltas = [1, -1, 2, -2];
  const adjusted = score + deltas[seed];

  if (adjusted <= 0 || adjusted >= 100) {
    return score >= 50
      ? score - 1
      : score + 1;
  }

  return adjusted;
}

async function analyzeRegions(
  regions,
  regionNewsMap = {},
  regionConflictMap = {}
) {
  try {
    const payload = regions.map(
      (region) =>
        buildRegionPayload(
          region,
          regionNewsMap[region.name] ||
            [],
          regionConflictMap[
            region.name
          ] || []
        )
    );

    console.log(
      "Generating batched regional intelligence..."
    );

    const response =
      await callOpenRouterChat({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: buildPrompt(payload),
          },
        ],
        temperature: 0.25,
        maxRetries: 2,
      });

    const content = extractContent(
      response
    );
    const parsed = parseJsonObject(
      content,
      null
    );

    if (!parsed) {
      console.log(
        "Invalid JSON response from AI intelligence call"
      );
      console.log(content);
      return null;
    }

    const regionResults =
      parsed.regions &&
      typeof parsed.regions ===
        "object"
        ? parsed.regions
        : parsed;

    const results = {};

    for (const region of regions) {
  const analysis =
    regionResults[region.name] || {};

  const activeConflicts =
    clampNumber(
      analysis.activeConflicts,
      0,
      50,
      Number(region.activeConflicts) || 0
    );

  const baseScore = clampNumber(
    analysis.riskScore,
    0,
    100,
    Number(region.riskScore) || 50
  );

  let riskScore =
    applyFineGrainAdjustment(
      baseScore,
      region,
      payload.find(
        (item) =>
          item.name === region.name
      )
    );

  if (activeConflicts === 0) {
    riskScore = Math.min(
      riskScore,
      40
    );
  } else if (
    activeConflicts === 1
  ) {
    riskScore = Math.min(
      riskScore,
      65
    );
  } else if (
    activeConflicts <= 3
  ) {
    riskScore = Math.min(
      riskScore,
      80
    );
  } else {
    riskScore = Math.min(
      riskScore,
      90
    );
  }

  results[region.name] = {
    riskScore,
    activeConflicts,
    forecast: normalizeForecast(
      analysis.forecast,
      riskScore
    ),
    summary: normalizeText(
      truncateWords(
        analysis.summary ||
          region.summary ||
          "",
        50
      ),
      region.summary || ""
    ),
    threatLevel:
      normalizeThreatLevel(
        analysis.threatLevel,
        riskScore
      ),
    assessment: normalizeText(
      truncateWords(
        analysis.assessment ||
          region.assessment ||
          "",
        100
      ),
      region.assessment ||
        region.summary ||
        "Assessment unavailable."
    ),
  };
}

    console.log(
      "Regional intelligence generated successfully."
    );

    return results;
  } catch (error) {
    if (!error?.isQuotaError) {
      console.error(
        "AI Analysis Failed"
      );
      console.error(
        error?.originalError?.error
          ?.message ||
          error?.originalError?.message ||
          error?.response?.data ||
          error?.message
      );
    }

    return null;
  }
}

module.exports = {
  analyzeRegions,
};