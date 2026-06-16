const News =
  require("../models/News");

exports.getNews =
  async (req, res) => {
    try {

      const news =
        await News.find()
          .sort({
            publishedAt: -1,
          });

      res.status(200).json(
        news
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

exports.getNewsByRegion =
  async (req, res) => {
    try {

      const news =
        await News.find({
          region: {
            $regex:
              new RegExp(
                req.params.region,
                "i"
              ),
          },
        })
          .sort({
            publishedAt: -1,
          })
          .limit(20);

      res.status(200).json(
        news
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };