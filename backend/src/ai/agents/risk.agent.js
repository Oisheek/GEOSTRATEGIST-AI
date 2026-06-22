const News = require("../../models/News");
const Conflict = require("../../models/Conflict");

const securityKeywords = [
  "war",
  "conflict",
  "attack",
  "missile",
  "military",
  "strike",
  "terror",
  "terrorism",
  "sanction",
  "nuclear",
  "riot",
  "protest",
  "insurgency",
  "border",
  "drone",
  "drones",
  "security",
  "army",
  "navy",
  "air force",
  "hostage",
  "ceasefire",
  "invasion",
  "troops",
  "rebel",
  "crisis",
  "violence",
  "humanitarian",
  "killed",
  "dead",
  "casualties",
  "soldiers",
  "military operation",
  "airstrike",
  "bombing",
  "shelling",
  "offensive",
  "defensive",
  "battle",
  "combat",
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

async function generateRisk(regionName) {
  try {
    const regionNews = await News.find({ region: regionName })
      .sort({ publishedAt: -1 })
      .limit(20);

    const filteredNews = regionNews.filter((article) => {
      const text = normalizeText(`${article.title || ""} ${article.description || ""} ${article.summary || ""}`);
      return securityKeywords.some((keyword) => text.includes(keyword));
    });

    const regionConflicts = await Conflict.find({ region: regionName });

    let riskScore = 20;
    riskScore += filteredNews.length * 6;
    riskScore += regionConflicts.filter((conflict) => ["Active", "Escalating"].includes(conflict.status)).length * 10;

    if (filteredNews.some((article) => normalizeText(article.title).includes("war") || normalizeText(article.description).includes("war"))) {
      riskScore += 10;
    }

    riskScore = clamp(riskScore, 0, 100);

    const activeConflicts = Math.max(
      regionConflicts.filter((conflict) => ["Active", "Escalating"].includes(conflict.status)).length,
      Math.floor(filteredNews.length / 5)
    );

    let threatLevel = "Low";
    if (riskScore >= 81) threatLevel = "Critical";
    else if (riskScore >= 61) threatLevel = "High";
    else if (riskScore >= 41) threatLevel = "Medium";

    const summary = filteredNews.length
      ? `${filteredNews.length} security-related developments detected in ${regionName}.`
      : `No recent security-related intelligence available for ${regionName}.`;

    return {
      riskScore,
      activeConflicts,
      threatLevel,
      summary,
    };
  } catch (error) {
    console.error("Risk Agent Error:", error.message);
    return {
      riskScore: 50,
      activeConflicts: 0,
      threatLevel: "Medium",
      summary: "Unable to generate risk assessment.",
    };
  }
}

module.exports = generateRisk;