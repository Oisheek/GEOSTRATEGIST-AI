const News = require("../models/News");

exports.getNews = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 500, 500);

    const news = await News.find()
      .sort({
        publishedAt: -1,
      })
      .limit(limit)
      .lean();

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getNewsByRegion = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 500, 500);

    const news = await News.find({
      region: {
        $regex: new RegExp(req.params.region, "i"),
      },
    })
      .sort({
        publishedAt: -1,
      })
      .limit(limit)
      .lean();

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};