const News =
  require("../models/News");

const Conflict =
  require("../models/Conflict");

const {
  discoverConflicts,
} = require(
  "../services/conflict-discovery.service"
);

function normalizeConflictName(
  name
) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/conflict$/i, "war")
    .replace(/tensions$/i, "tensions");
}

async function updateConflicts() {

  try {

    console.log(
      "Starting Conflict Discovery..."
    );

    const news =
      await News.find()
        .sort({
          publishedAt: -1,
        })
        .limit(50);

    const conflicts =
      await discoverConflicts(
        news
      );

    console.log(
      `Found ${conflicts.length} conflicts`
    );

    for (
      const conflict of conflicts
    ) {

      conflict.name =
        conflict.name
          .trim()
          .replace(/\s+/g, " ");

      const normalizedName =
        normalizeConflictName(
          conflict.name
        );

      await Conflict.findOneAndUpdate(
        {
          normalizedName,
        },
        {
          ...conflict,

          normalizedName,

          updatedAt:
            new Date(),
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );

      console.log(
        `Updated ${conflict.name}`
      );

    }

    console.log(
      "Conflict Discovery Complete"
    );

  } catch (err) {

    console.error(
      "Conflict Discovery Job Failed"
    );

    console.error(err);

  }

}

module.exports =
  updateConflicts;