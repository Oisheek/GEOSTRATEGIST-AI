const Region =
  require("../models/Region");

exports.getRegions =
async () => {
  return Region.find();
};

exports.getRegionById =
async (id) => {
  return Region.findById(id);
};

exports.createRegion =
async (data) => {
  return Region.create(data);
};