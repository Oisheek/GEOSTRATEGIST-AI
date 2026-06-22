const Region = require("../models/Region");
const News = require("../models/News");
const { buildAssessment } = require("../services/assessment.service");

console.log("assessment.job loaded");

async function updateAssessments() {
  try {
    console.log("Starting AI Regional Assessment Update...");

    const regions = await Region.find();
    console.log(`Found ${regions.length} regions`);

    if (!regions.length) {
      console.log("AI Regional Assessment Update Complete");
      return;
    }

    const regionNames = regions.map((region) => region.name);
    const newsItems = await News.find({ region: { $in: regionNames } })
      .sort({ publishedAt: -1 })
      .lean();

    const newsByRegion = newsItems.reduce((acc, article) => {
      const key = article.region || "Global";
      if (!acc[key]) acc[key] = [];
      acc[key].push(article);
      return acc;
    }, {});

    let updatedCount = 0;

    for (const region of regions) {
      try {
        console.log(`Processing ${region.name}`);

        const regionNews = (newsByRegion[region.name] || []).slice(0, 10);
        console.log(`${region.name}: ${regionNews.length} articles`);

        if (region.assessment && String(region.assessment).trim()) {
          continue;
        }

        const assessment = buildAssessment(region, regionNews, {
          riskScore: region.riskScore,
          activeConflicts: region.activeConflicts,
          summary: region.summary,
          threatLevel: region.threatLevel,
          assessment: region.assessment,
        });

        if (assessment && assessment !== "Assessment unavailable.") {
          region.assessment = assessment;
          region.assessmentUpdatedAt = new Date();
          await region.save();
          updatedCount += 1;
          console.log(`Backfilled assessment for ${region.name}`);
        }
      } catch (err) {
        console.error(`Failed region ${region.name}:`);
        console.error(err);
      }
    }

    console.log(
      updatedCount > 0
        ? `Assessment fallback updated ${updatedCount} regions`
        : "All region assessments were already present"
    );
    console.log("AI Regional Assessment Update Complete");
  } catch (err) {
    console.error("Assessment job failed:");
    console.error(err);
  }
}

module.exports = updateAssessments;