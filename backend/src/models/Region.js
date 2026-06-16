const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      default: 50,
    },

    summary: String,

    activeConflicts: {
      type: Number,
      default: 0,
    },
    threatLevel: {
  type: String,
  default: "Low",
},

    newsCount: {
      type: Number,
      default: 0,
    },

    forecast: {
      escalation: Number,
      stability: Number,
      deEscalation: Number,
    },
   assessment: {
  type: String,
  default: "",
},

assessmentUpdatedAt: {
  type: Date,
},

nextNewsUpdate: {
  type: Date,
},

lastUpdated: {
  type: Date,
  default: Date.now,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Region",
  regionSchema
);