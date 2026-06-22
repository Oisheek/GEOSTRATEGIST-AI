require("dotenv").config();
const app = require("./app");
const connectDB =
  require("./config/db");
async function startServer() {
  try {
    await connectDB();
    console.log(
      "MongoDB Connected Successfully"
    );
    require("./jobs/news.job");
    require("./jobs/assessment.job");
    require("./jobs/cleanup.job");
    require("./jobs/risk.job");

    const updateConflictAssessments =
      require(
        "./jobs/conflict-assessment.job"
      );
    updateConflictAssessments();
    const PORT =
      process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );

    });
  } catch (err) {
    console.error(
      "Failed to start server"
    );
    console.error(err);
    process.exit(1);
  }
}
startServer();