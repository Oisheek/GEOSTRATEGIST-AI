const {
  callOpenRouterChat,
  extractContent,
} = require("../utils/openrouter.service");

const {
  parseJsonObject,
} = require("../utils/aiJson");

const MODEL =
  "openai/gpt-oss-120b:free";

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function truncateWords(text, maxWords) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function normalizeText(value, fallback = "") {
  const text = String(value || fallback)
    .replace(/```/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
}

function normalizeThreatLevel(value, riskScore) {
  const allowed = ["Low", "Medium", "High", "Critical"];
  if (allowed.includes(value)) return value;

  const score = Number(riskScore) || 50;
  if (score >= 81) return "Critical";
  if (score >= 61) return "High";
  if (score >= 41) return "Medium";
  return "Low";
}

function normalizeForecast(forecast, riskScore) {
  const safeForecast = forecast && typeof forecast === "object" ? forecast : {};
  const score = clampNumber(riskScore, 0, 100, 50);

  let escalation = clampNumber(
    safeForecast.escalation,
    0,
    100,
    Math.max(0, Math.min(100, Math.round(score * 0.6)))
  );
  let stability = clampNumber(
    safeForecast.stability,
    0,
    100,
    Math.max(0, Math.min(100, 100 - score))
  );
  let deEscalation = clampNumber(
    safeForecast.deEscalation,
    0,
    100,
    Math.max(0, Math.min(100, 100 - escalation - stability))
  );

  const total = escalation + stability + deEscalation;
  if (total !== 100) {
    const scale = 100 / Math.max(1, total);
    escalation = Math.round(escalation * scale);
    stability = Math.round(stability * scale);
    deEscalation = Math.max(0, 100 - escalation - stability);
  }

  return {
    escalation,
    stability,
    deEscalation,
  };
}

function buildRegionPayload(region, news) {
  return {
    name: region.name,
    currentRiskScore: Number(region.riskScore) || 50,
    currentActiveConflicts: Number(region.activeConflicts) || 0,
    currentThreatLevel: region.threatLevel || "Low",
    currentSummary: region.summary || "",
    headlines: (news || []).slice(0, 6).map((article) => ({
      title: normalizeText(article.title, ""),
      description: truncateWords(
        normalizeText(article.description || article.content || "", ""),
        28
      ),
      source: normalizeText(article.source || "", ""),
      publishedAt: article.publishedAt || article.publish_date || article.pubDate || null,
    })),
  };
}

function buildPrompt(regionsPayload) {
  return `
You are a senior geopolitical intelligence analyst.

Analyze the following regional news packets and return a single JSON object.
Use the exact region names from the input.
Do not invent regions.
Do not use markdown or code fences.
Output JSON only.

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
- If a region has little or no news, keep the risk conservative and explain the absence of strong signals.

Input JSON:
${JSON.stringify({ regions: regionsPayload })}

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

async function analyzeRegions(regions, regionNewsMap = {}) {
  try {
    const payload = regions.map((region) =>
      buildRegionPayload(region, regionNewsMap[region.name] || [])
    );

    console.log("Generating batched regional intelligence...");

    const response = await callOpenRouterChat({
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

    const content = extractContent(response);
    const parsed = parseJsonObject(content, null);

    if (!parsed) {
      console.log("Invalid JSON response from AI intelligence call");
      console.log(content);
      return null;
    }

    const regionResults = parsed.regions && typeof parsed.regions === "object"
      ? parsed.regions
      : parsed;

    const results = {};

    for (const region of regions) {
      const analysis = regionResults[region.name] || {};
      const riskScore = clampNumber(analysis.riskScore, 0, 100, Number(region.riskScore) || 50);
      const activeConflicts = clampNumber(
        analysis.activeConflicts,
        0,
        50,
        Number(region.activeConflicts) || 0
      );
      
      results[region.name] = {
        riskScore,
        activeConflicts,
        forecast: normalizeForecast(analysis.forecast, riskScore),
        summary: normalizeText(
          truncateWords(analysis.summary || region.summary || "", 50),
          region.summary || ""
        ),
        threatLevel: normalizeThreatLevel(analysis.threatLevel, riskScore),
        assessment: normalizeText(
          truncateWords(analysis.assessment || region.assessment || "", 100),
          region.assessment || region.summary || "Assessment unavailable."
        ),
      };
    }

    console.log("Regional intelligence generated successfully.");

    return results;
  } catch (error) {
    if (!error?.isQuotaError) {
      console.error("AI Analysis Failed");
      console.error(error?.originalError?.error?.message || error?.originalError?.message || error?.response?.data || error?.message);
    }

    return null;
  }
}

module.exports = {
  analyzeRegions,
};