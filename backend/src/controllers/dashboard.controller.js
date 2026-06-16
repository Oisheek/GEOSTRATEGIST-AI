const Region = require("../models/Region");
const Conflict = require("../models/Conflict");

const getDashboardStats = async (req, res) => {
  try {

    // Active conflicts
    const activeConflicts =
      await Conflict.countDocuments({
        status: {
          $in: ["Active", "Escalating"],
        },
      });

    // Threat Index
    const regions =
      await Region.find();

    const threatIndex =
      regions.length > 0
        ? Math.round(
            regions.reduce(
              (sum, region) =>
                sum + region.riskScore,
              0
            ) / regions.length
          )
        : 0;

    // Alerts
    const alerts =
      await Conflict.countDocuments({
        severity: {
          $in: ["High", "Critical"],
        },
      });

    // Forecast Accuracy
    const forecastAccuracy =
      regions.length > 0
        ? Math.round(
            regions.reduce(
              (sum, region) =>
                sum +
                (region.forecast?.stability || 0),
              0
            ) / regions.length
          )
        : 0;

    res.json({
      activeConflicts,
      threatIndex,
      alerts,
      forecastAccuracy,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to load dashboard stats",
    });

  }
};

module.exports = {
  getDashboardStats,
};