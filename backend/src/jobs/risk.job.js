console.log("Risk job loaded");

const cron = require("node-cron");
const Region = require("../models/Region");
const generateRisk =
  require("../ai/agents/risk.agent");

async function updateRiskScores() {

  console.log(
    "Updating geopolitical risk scores..."
  );

  try {

    const regions =
      await Region.find();

    console.log(
      `Found ${regions.length} regions`
    );

    for (const region of regions) {

      try {

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

        console.log(
          `${region.name} -> Risk:${region.riskScore} | Conflicts:${region.activeConflicts}`
        );

        // Prevent OpenRouter rate limits
        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              3000
            )
        );

      } catch (err) {

        console.error(
          `Failed updating ${region.name}:`,
          err.message
        );

      }

    }

    console.log(
      "Risk update completed"
    );

  } catch (err) {

    console.error(
      "Risk job failed:",
      err.message
    );

  }

}

// Run every hour
cron.schedule(
  "0 */6 * * *",
  updateRiskScores
);

// Run once on startup
updateRiskScores();