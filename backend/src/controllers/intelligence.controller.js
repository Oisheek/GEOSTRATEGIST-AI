const Region =
  require("../models/Region");

exports.dashboard =
  async (
    req,
    res
  ) => {

    const regions =
      await Region.find();

    const activeConflicts =
      regions.reduce(
        (
          sum,
          region
        ) =>
          sum +
          region.activeConflicts,
        0
      );

    const threatIndex =
      Math.round(
        regions.reduce(
          (
            sum,
            region
          ) =>
            sum +
            region.riskScore,
          0
        ) /
          regions.length
      );

    const alerts =
      regions.filter(
        (r) =>
          r.riskScore >
          75
      ).length;

    res.json({
      activeConflicts,
      threatIndex,
      alerts,
      forecastAccuracy:
        92,
    });
  };