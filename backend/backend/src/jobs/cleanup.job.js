const cron =
  require("node-cron");

const News =
  require("../models/News");

async function cleanupNews() {

  try {

    const cutoff =
      new Date();

    cutoff.setDate(
      cutoff.getDate() - 30
    );

    const result =
      await News.deleteMany({
        publishedAt: {
          $lt: cutoff,
        },
      });

    console.log(
      `Deleted ${result.deletedCount} old articles`
    );

  } catch (error) {

    console.error(error);

  }
}

cron.schedule(
  "0 2 * * *",
  cleanupNews
);

module.exports =
  cleanupNews;