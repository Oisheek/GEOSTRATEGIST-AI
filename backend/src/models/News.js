const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    url: {
      type: String,
      unique: true,
    },

    source: String,

    publishedAt: Date,

    region: {
      type: String,
      required: true,
    },

    sentiment: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "News",
  NewsSchema
);