console.log("Risk job loaded");

const cron = require("node-cron");
const Region = require("../models/Region");
const generateRisk = require("../ai/agents/risk.agent");

const ENABLE_LEGACY_RISK_JOB =
  String(
    process.env.ENABLE_LEGACY_RISK_JOB
  ).toLowerCase() === "true";

console.log(
  "ENABLE_LEGACY_RISK_JOB:",
  ENABLE_LEGACY_RISK_JOB
);

async function updateRiskScores() {

  if (!ENABLE_LEGACY_RISK_JOB) {

    console.log(
      "Legacy risk job disabled."
    );

    return;

  }

  console.log(
    "Updating geopolitical risk scores..."
  );

  try {

    const regions =
      await Region.find();

    for (const region of regions) {

      const aiData =
        await generateRisk(
          region.name
        );

      region.riskScore =
        aiData.riskScore;

      region.activeConflicts =
        aiData.activeConflicts;

      region.summary =
        aiData.summary;

      region.lastUpdated =
        new Date();

      await region.save();

    }

    console.log(
      "Risk update completed"
    );

  } catch (err) {

    console.error(
      "Risk job failed:"
    );

    console.error(err);

  }

}

if (
  ENABLE_LEGACY_RISK_JOB
) {

  cron.schedule(
    "0 */6 * * *",
    updateRiskScores
  );

  updateRiskScores();

}

module.exports =
  updateRiskScores;