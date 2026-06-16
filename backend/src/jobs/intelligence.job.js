const Region =
  require("../models/Region");

const News =
  require("../models/News");

const {
  analyzeRegion,
} = require(
  "../services/intelligence.service"
);

async function updateRegionIntel() {

  try {

    console.log(
      "================================="
    );

    console.log(
      "Starting AI Intelligence..."
    );

    const regions =
      await Region.find();

    console.log(
      `Found ${regions.length} regions`
    );

    for (
      const region of regions
    ) {

      try {

        console.log(
          `Processing ${region.name}`
        );

        const news =
          await News.find({
            region:
              region.name,
          })
            .sort({
              publishedAt: -1,
            })
            .limit(5);

        console.log(
          `${region.name}: ${news.length} articles`
        );

        if (
          news.length === 0
        ) {

          console.log(
            `Skipping ${region.name} (no news)`
          );

          continue;
        }

        const analysis =
          await analyzeRegion(
            region.name,
            news
          );

        if (
          !analysis
        ) {

          console.log(
            `No analysis generated for ${region.name}`
          );

          continue;
        }

        region.riskScore =
          analysis.riskScore || 50;

        region.activeConflicts =
          analysis.activeConflicts || 0;

        region.summary =
          analysis.summary ||
          region.summary;

        region.threatLevel =
          analysis.threatLevel ||
          "Medium";

        region.forecast =
          analysis.forecast || {
            escalation: 33,
            stability: 34,
            deEscalation: 33,
          };

        region.lastUpdated =
          new Date();

        await region.save();

        console.log(
          `Updated ${region.name}`
        );

        console.log(
          `Risk Score: ${region.riskScore}`
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              5000
            )
        );

      } catch (regionError) {

        console.error(
          `Failed region ${region.name}`
        );

        console.error(
          regionError
        );

      }

    }

    console.log(
      "AI Intelligence Complete"
    );

    console.log(
      "================================="
    );

  } catch (error) {

    console.error(
      "AI Intelligence Job Failed"
    );

    console.error(error);

  }

}

module.exports =
  updateRegionIntel;