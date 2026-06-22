const Region = require("../models/Region");
const News = require("../models/News");
const Conflict = require("../models/Conflict");
const { analyzeRegions } = require("../services/intelligence.service");

function groupNewsByRegion(newsItems = []) {
  return newsItems.reduce((acc, article) => {
    const key = article.region || "Global";
    if (!acc[key]) acc[key] = [];
    acc[key].push(article);
    return acc;
  }, {});
}

function groupConflictsByRegion(conflicts = []) {
  return conflicts.reduce((acc, conflict) => {
    const key = conflict.region || "Global";
    if (!acc[key]) acc[key] = [];
    acc[key].push(conflict);
    return acc;
  }, {});
}

async function updateRegionIntel() {
  try {
    console.log("=================================");
    console.log("Starting AI Intelligence...");

    const regions = await Region.find();
    console.log(`Found ${regions.length} regions`);

    if (!regions.length) {
      console.log("No regions found");
      console.log("AI Intelligence Complete");
      console.log("=================================");
      return;
    }

    const regionNames = regions.map((region) => region.name);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const newsItems = await News.find({
      region: { $in: regionNames },
      publishedAt: { $gte: sevenDaysAgo },
    })
      .sort({ publishedAt: -1 })
      .lean();

    const conflicts = await Conflict.find({
      region: { $in: regionNames },
      status: { $ne: "Resolved" },
    }).lean();

    const groupedNews = groupNewsByRegion(newsItems);
    const groupedConflicts = groupConflictsByRegion(conflicts);

    for (const regionName of regionNames) {
      groupedNews[regionName] = (groupedNews[regionName] || []).slice(0, 3);

      groupedConflicts[regionName] = groupedConflicts[regionName] || [];
    }

    const analysisByRegion = await analyzeRegions(
      regions,
      groupedNews,
      groupedConflicts
    );

    if (!analysisByRegion) {
      console.log("No intelligence generated. Keeping existing region values.");
      console.log("AI Intelligence Complete");
      console.log("=================================");
      return;
    }

    for (const region of regions) {
      try {
        const analysis = analysisByRegion[region.name];

        if (!analysis) {
          console.log(`Skipping ${region.name} (no analysis returned)`);
          continue;
        }

        const regionConflictCount = groupedConflicts[region.name]?.length || 0;
        
        region.riskScore = analysis.riskScore;
        region.activeConflicts = regionConflictCount;
        region.summary = analysis.summary;
        region.threatLevel = analysis.threatLevel;
        region.forecast = analysis.forecast;
        region.assessment = analysis.assessment;
        region.assessmentUpdatedAt = new Date();
        region.lastUpdated = new Date();

        await region.save();

        console.log(`Updated ${region.name}`);
        console.log(`Risk Score: ${region.riskScore}`);
      } catch (regionError) {
        console.error(`Failed region ${region.name}`);
        console.error(regionError);
      }
    }

    console.log("AI Intelligence Complete");
    console.log("=================================");
  } catch (error) {
    console.error("AI Intelligence Job Failed");
    console.error(error);
  }
}

module.exports = updateRegionIntel;