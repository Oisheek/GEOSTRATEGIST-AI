const router =
  require("express").Router();

const {
  getNews,
  getNewsByRegion,
} = require(
  "../controllers/news.controller"
);

router.get(
  "/",
  getNews
);

router.get(
  "/region/:region",
  getNewsByRegion
);

module.exports =
  router;