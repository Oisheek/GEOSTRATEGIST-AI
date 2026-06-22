const RegionService = require(
  "../services/region.service"
);

exports.getRegions = async (
  req,
  res
) => {
  try {
    const regions =
      await RegionService.getRegions();

    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRegion = async (
  req,
  res
) => {
  try {
    const region =
      await RegionService.getRegionById(
        req.params.id
      );

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    res.status(200).json(region);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createRegion = async (
  req,
  res
) => {
  try {
    const region =
      await RegionService.createRegion(
        req.body
      );

    res.status(201).json({
      success: true,
      region,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};