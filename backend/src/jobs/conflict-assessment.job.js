const Conflict = require("../models/Conflict");
const { callOpenRouterChat, extractContent } = require("../utils/openrouter.service");
const { parseJsonObject } = require("../utils/aiJson");

const MODEL = "openai/gpt-oss-120b:free";

function normalizeConflictName(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/conflict$/i, "war")
    .replace(/tensions$/i, "tensions");
}

function normalizeText(value, fallback = "") {
  const text = String(value || fallback)
    .replace(/```/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || fallback;
}

async function analyzeAllConflicts(conflicts) {
  const prompt = `
You are a geopolitical intelligence analyst.

Analyze the following conflicts and return a single JSON object.
Use the exact conflict names from the input where possible.
Do not invent conflicts.
Do not use markdown or code fences.
Output JSON only.

For each conflict return:
{
  "riskScore": 0-100,
  "forecast": "under 80 words",
  "summary": "under 80 words"
}

Rules:
- riskScore must be a NUMBER.
- If a conflict is active, keep riskScore above 50.
- Keep forecasts concise and operational.

Input JSON:
${JSON.stringify({ conflicts })}

Return only this shape:
{
  "conflicts": [
    {
      "name": "",
      "riskScore": 0,
      "forecast": "",
      "summary": ""
    }
  ]
}
`;

  const response = await callOpenRouterChat({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.25,
    maxRetries: 2,
  });

  const content = extractContent(response);
  const parsed = parseJsonObject(content, null);
  if (!parsed) {
    console.log("Invalid JSON returned for conflict assessments");
    console.log(content);
    return null;
  }

  const list = Array.isArray(parsed.conflicts)
    ? parsed.conflicts
    : Array.isArray(parsed)
      ? parsed
      : [];

  const map = {};
  for (const item of list) {
    if (!item || !item.name) continue;
    map[normalizeConflictName(item.name)] = {
      name: normalizeText(item.name, ""),
      riskScore: Number(item.riskScore),
      forecast: normalizeText(item.forecast, ""),
      summary: normalizeText(item.summary, ""),
    };
  }

  return map;
}

async function updateConflictAssessments() {
  try {
    console.log("=================================");
    console.log("Starting Conflict Intelligence...");

    const conflicts = await Conflict.find();
    console.log(`Found ${conflicts.length} conflicts`);

    if (!conflicts.length) {
      console.log("No conflicts found");
      console.log("Conflict Intelligence Complete");
      console.log("=================================");
      return;
    }

    const payload = conflicts.map((conflict) => ({
      name: conflict.name,
      region: conflict.region,
      severity: conflict.severity,
      status: conflict.status,
      summary: conflict.summary,
      actors: conflict.actors || [],
      aiRiskScore: conflict.aiRiskScore,
    }));

    const analysisByConflict = await analyzeAllConflicts(payload);

    if (!analysisByConflict) {
      console.log("No conflict intelligence generated. Keeping existing values.");
      console.log("Conflict Intelligence Complete");
      console.log("=================================");
      return;
    }

    for (const conflict of conflicts) {
      try {
        console.log(`Analyzing ${conflict.name}`);

        const normalizedName = normalizeConflictName(conflict.name);
        const analysis = analysisByConflict[normalizedName] || analysisByConflict[conflict.name];

        if (!analysis) {
          console.log(`No analysis returned for ${conflict.name}`);
          continue;
        }

        conflict.aiRiskScore = Number.isFinite(Number(analysis.riskScore))
          ? Number(analysis.riskScore)
          : conflict.aiRiskScore;
        conflict.aiSummary = analysis.summary || conflict.aiSummary;
        conflict.aiForecast = analysis.forecast || conflict.aiForecast;
        conflict.lastAnalyzed = new Date();

        await conflict.save();

        console.log(`Updated ${conflict.name}`);
      } catch (err) {
        console.error(conflict.name);
        console.error(err);
      }
    }

    console.log("Conflict Intelligence Complete");
    console.log("=================================");
  } catch (err) {
    console.error("Conflict Assessment Job Failed");
    console.error(err);
  }
}

module.exports = updateConflictAssessments;