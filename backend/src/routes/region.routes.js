const router =
  require("express").Router();

const {
  getRegions,
  getRegion,
  createRegion,
} = require(
  "../controllers/region.controller"
);

router.get(
  "/",
  getRegions
);

router.get(
  "/:id",
  getRegion
);

router.post(
  "/",
  createRegion
);

module.exports = router;