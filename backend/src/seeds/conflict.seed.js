const mongoose =
  require("mongoose");

require("dotenv").config();

const Conflict =
  require("../models/Conflict");

const conflicts = [
 {
  name: "Russia-Ukraine War",
  region: "Europe",
  severity: "Critical",
  status: "Active",
  actors: ["Russia","Ukraine"],
  lat: 50.45,
  lng: 30.52,
  summary:
    "Ongoing military conflict."
},

{
  name: "Israel-Gaza Conflict",
  region: "Middle East",
  severity: "Critical",
  status: "Active",
  actors: ["Israel","Hamas"],
  lat: 31.5,
  lng: 34.4,
  summary:
    "High-intensity regional conflict."
},

{
  name: "Taiwan Strait Tensions",
  region: "East Asia",
  severity: "High",
  status: "Monitoring",
  actors: ["China","Taiwan"],
  lat: 23.7,
  lng: 121,
  summary:
    "Military activity remains elevated."
},

{
  name: "Sudan Conflict",
  region: "Africa",
  severity: "High",
  status: "Active",
  actors: ["SAF","RSF"],
  lat: 15.5,
  lng: 32.5,
  summary:
    "Civil conflict causing instability."
},
];

async function seed() {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    await Conflict.deleteMany();

    await Conflict.insertMany(
      conflicts
    );

    console.log(
      "Conflicts seeded"
    );

    process.exit(0);

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

}

seed();