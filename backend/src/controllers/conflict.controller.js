const Conflict =
  require("../models/Conflict");

exports.getConflicts =
  async (
    req,
    res
  ) => {

    try {

      const conflicts =
        await Conflict.find();

      res.json(
        conflicts
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };