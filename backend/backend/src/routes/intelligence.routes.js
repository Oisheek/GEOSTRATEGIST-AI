const router =
  require("express")
    .Router();

const {
  dashboard,
} = require(
  "../controllers/intelligence.controller"
);

router.get(
  "/dashboard",
  dashboard
);

module.exports =
  router;