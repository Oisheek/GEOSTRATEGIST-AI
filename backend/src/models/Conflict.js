const mongoose =
  require("mongoose");

const conflictSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      normalizedName: {
        type: String,
        unique: true,
        index: true,
      },

      region: String,

      severity: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High",
          "Critical",
        ],
      },

      status: {
        type: String,
        enum: [
          "Monitoring",
          "Active",
          "Escalating",
          "Resolved",
        ],
      },

      summary: String,

      actors: [String],

      aiRiskScore: {
        type: Number,
        default: 50,
      },

      aiSummary: {
        type: String,
        default: "",
      },

      aiForecast: {
        type: String,
        default: "",
      },

      lastAnalyzed: {
        type: Date,
      },

      lat: Number,

      lng: Number,
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Conflict",
    conflictSchema
  );