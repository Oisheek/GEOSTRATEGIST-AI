
const cron = require("node-cron");

const News =
  require("../models/News");

const Region =
  require("../models/Region");

const assignRegion =
  require("../utils/assignRegion");

const {
  fetchWorldNews,
  fetchHeadlineFeed,
} = require(
  "../services/news.service"
);

const updateAssessments =
  require("./assessment.job");

const updateRegionIntel =
  require("./intelligence.job");

const updateConflicts =
  require(
    "./conflict-discovery.job"
  );

async function syncNews() {

  try {

    console.log(
      "================================="
    );

    console.log(
      "Checking for latest news..."
    );

    const world =
      await fetchWorldNews();

    const feed =
      await fetchHeadlineFeed();

    const articles = [
      ...world,
      ...feed,
    ];

    console.log(
      `Fetched ${articles.length} articles`
    );

    let hasNewArticles =
      false;

    for (
      const article of articles
    ) {

      try {

        const title =
          article.title || "";

        const description =
          article.description || "";

        const url =
          article.url ||
          article.link;

        if (!url)
          continue;

        const existing =
          await News.findOne({
            url,
          });

        if (existing)
          continue;

        hasNewArticles =
          true;

        const region =
          assignRegion(
            `${title} ${description}`
          );

        await News.create({
          title,

          description,

          url,

          source:
            article.source ||
            "",

          publishedAt:
            article.publish_date ||
            article.pubDate ||
            new Date(),

          region,
        });

      } catch (err) {

        console.error(
          "Failed to save article"
        );

        console.error(err);

      }
    }

    for (
      const regionName of [
        "North America",
        "South America",
        "Europe",
        "Africa",
        "Middle East",
        "South Asia",
        "East Asia",
        "Oceania",
      ]
    ) {

      const count =
        await News.countDocuments({
          region:
            regionName,
        });

      await Region.updateOne(
        {
          name:
            regionName,
        },
        {
          newsCount:
            count,

          nextNewsUpdate:
            new Date(
              Date.now() +
              12 *
              60 *
              60 *
              1000
            ),
        }
      );
    }

    if (
      hasNewArticles
    ) {

      console.log(
        "New articles found."
      );

      console.log(
        "Starting Conflict Discovery..."
      );

      await updateConflicts();

      console.log(
        "Conflict Discovery Complete."
      );

      console.log(
        "Starting AI Regional Intelligence..."
      );

      await updateRegionIntel();

      console.log(
        "Regional Intelligence Complete."
      );

      console.log(
        "Starting AI Assessments..."
      );

      await updateAssessments();

      console.log(
        "Assessments Complete."
      );

    } else {

      console.log(
        "No new articles found."
      );

    }

    console.log(
      "================================="
    );

  } catch (error) {

    console.error(
      "News Job Error:"
    );

    console.error(error);

  }
}

cron.schedule(
  "0 */12 * * *",
  syncNews
);

syncNews();

module.exports =
  syncNews;

