const router =
  require("express").Router();

const {
  getConflicts,
} = require(
  "../controllers/conflict.controller"
);

router.get(
  "/",
  getConflicts
);

module.exports =
  router;