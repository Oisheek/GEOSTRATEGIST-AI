require("dotenv").config();

const connectDB =
  require("../config/db");

const Region =
  require("../models/Region");

  const regions = [
    {
      name: "North America",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  
    {
      name: "South America",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  
    {
      name: "Europe",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  
    {
      name: "Africa",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  
    {
      name: "Middle East",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  
    {
      name: "South Asia",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  
    {
      name: "East Asia",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  
    {
      name: "Oceania",
      riskScore: 0,
      summary: "Waiting for AI analysis...",
      activeConflicts: 0,
      newsCount: 0,
      forecast: {
        escalation: 0,
        stability: 0,
        deEscalation: 0,
      },
    },
  ];
async function seedRegions() {
  try {

    console.log(
      "MONGO_URI:",
      process.env.MONGO_URI
    );

    await connectDB();

    await Region.deleteMany({});

    await Region.insertMany(
      regions
    );

    console.log(
      "Regions seeded successfully"
    );

    process.exit(0);

  } catch (error) {

    console.error(error);

    process.exit(1);

  }
}

seedRegions();