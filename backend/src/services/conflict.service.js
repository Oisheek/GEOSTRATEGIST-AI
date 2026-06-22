const Conflict =
  require("../models/Conflict");

exports.getConflicts =
  async () =>
    Conflict.find();

exports.getConflict =
  async (id) =>
    Conflict.findById(id);