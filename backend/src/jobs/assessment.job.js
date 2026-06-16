const Region =
  require("../models/Region");

const News =
  require("../models/News");

const {
  generateAssessment,
} = require(
  "../services/assessment.service"
);

console.log(
  "assessment.job loaded"
);

async function updateAssessments() {

  try {

    console.log(
      "Starting AI Regional Assessment Update..."
    );

    const regions =
      await Region.find();

    console.log(
      `Found ${regions.length} regions`
    );

    for (const region of regions) {

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
            .limit(20);

        console.log(
          `${region.name}: ${news.length} articles`
        );

        const assessment =
          await generateAssessment(
            region,
            news
          );

        if (
          assessment &&
          assessment !==
            "Assessment unavailable."
        ) {

          region.assessment =
            assessment;

          region.assessmentUpdatedAt =
            new Date();

          await region.save();

          console.log(
            `Updated assessment for ${region.name}`
          );

        }

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              5000
            )
        );

      } catch (err) {

        console.error(
          `Failed region ${region.name}:`
        );

        console.error(err);

      }

    }

    console.log(
      "AI Regional Assessment Update Complete"
    );

  } catch (err) {

    console.error(
      "Assessment job failed:"
    );

    console.error(err);

  }

}

module.exports =
  updateAssessments;