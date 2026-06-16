const Region = require("../models/Region");
const {
  fetchWorldNews,
} = require("./news.service");

async function updateRegions() {
  const news = await fetchWorldNews();

  const regions = await Region.find();

  for (const region of regions) {
    const regionNews = news.filter(article => {
      const text =
        `${article.title || ""} ${article.text || ""}`;

      return text
        .toLowerCase()
        .includes(region.name.toLowerCase());
    });

    const newsCount = regionNews.length;

    let riskScore = 20;

    riskScore += newsCount * 3;

    if (riskScore > 100)
      riskScore = 100;

    let activeConflicts = Math.floor(
      newsCount / 5
    );

    let threatLevel = "Low";

    if (riskScore > 70)
      threatLevel = "High";
    else if (riskScore > 40)
      threatLevel = "Medium";

    await Region.findByIdAndUpdate(
      region._id,
      {
        riskScore,
        activeConflicts,
        newsCount,
        threatLevel,
        summary:
          `${newsCount} recent developments detected.`,
        lastUpdated: new Date(),
      }
    );
  }
}

module.exports = {
  updateRegions,
};