const News = require("../models/News");
const Conflict = require("../models/Conflict");

const {
  discoverConflicts,
  normalizeConflictKey,
  shouldKeepConflict,
} = require("../services/conflict-discovery.service");

function normalizeConflictName(name) {
  return normalizeConflictKey(name);
}

function mergeConflictLists(existing, incoming) {
  const merged = new Map();

  for (const conflict of [...(existing || []), ...(incoming || [])]) {
    if (!conflict || !conflict.name) continue;

    const key = normalizeConflictKey(conflict.name);
    if (!key) continue;

    const prev = merged.get(key);

    if (!prev) {
      merged.set(key, conflict);
      continue;
    }

    const severityOrder = {
      Low: 1,
      Medium: 2,
      High: 3,
      Critical: 4,
    };

    const statusOrder = {
      Monitoring: 1,
      Active: 2,
      Escalating: 3,
      Resolved: 0,
    };

    const prevSeverity = severityOrder[prev.severity] || 2;
    const nextSeverity = severityOrder[conflict.severity] || 2;

    const prevStatus = statusOrder[prev.status] || 1;
    const nextStatus = statusOrder[conflict.status] || 1;

    if (
      nextSeverity > prevSeverity ||
      (nextSeverity === prevSeverity && nextStatus > prevStatus)
    ) {
      merged.set(key, conflict);
    }
  }

  return Array.from(merged.values());
}

async function cleanupInvalidConflicts() {
  const existingConflicts = await Conflict.find().lean();
  let removedCount = 0;

  for (const conflict of existingConflicts) {
    if (!shouldKeepConflict(conflict)) {
      await Conflict.deleteOne({ _id: conflict._id });
      removedCount += 1;
    }
  }

  return removedCount;
}

async function updateConflicts() {
  try {

    console.log("=================================");
    console.log("Starting Conflict Discovery...");

    const news = await News.find()
      .sort({
        publishedAt: -1,
      })
      .limit(500)
      .lean();

    if (!news.length) {

      console.log(
        "No news available for conflict discovery"
      );

      return;
    }

    const chunkSize = 25;

    const allDiscovered = [];

    for (
      let i = 0;
      i < news.length;
      i += chunkSize
    ) {

      const chunk =
        news.slice(
          i,
          i + chunkSize
        );

      console.log(
        `Analyzing articles ${i + 1}-${Math.min(
          i + chunkSize,
          news.length
        )}`
      );

      const conflicts =
        await discoverConflicts(
          chunk
        );

      if (
        conflicts &&
        conflicts.length
      ) {

        allDiscovered.push(
          ...conflicts
        );

      }

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            2000
          )
      );
    }

    const deduped =
      new Map();

    for (
      const conflict of allDiscovered
    ) {

      if (
        !conflict ||
        !conflict.name
      ) {
        continue;
      }

      const normalizedName =
        normalizeConflictName(
          conflict.name
        );

      const existing =
        deduped.get(
          normalizedName
        );

      if (
        !existing
      ) {

        deduped.set(
          normalizedName,
          {
            ...conflict,
            normalizedName,
          }
        );

        continue;
      }

      const severityRank = {
        Low: 1,
        Medium: 2,
        High: 3,
        Critical: 4,
      };

      const existingRank =
        severityRank[
          existing.severity
        ] || 1;

      const newRank =
        severityRank[
          conflict.severity
        ] || 1;

      if (
        newRank >
        existingRank
      ) {

        deduped.set(
          normalizedName,
          {
            ...conflict,
            normalizedName,
          }
        );

      }
    }

    const finalConflicts =
      Array.from(
        deduped.values()
      );

    console.log(
      `Found ${finalConflicts.length} unique conflicts`
    );

    for (
      const conflict of finalConflicts
    ) {

      await Conflict.findOneAndUpdate(
        {
          normalizedName:
            conflict.normalizedName,
        },
        {
          ...conflict,
          updatedAt:
            new Date(),
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log(
        `Updated ${conflict.name}`
      );
    }

    console.log(
      "Conflict Discovery Complete"
    );

    console.log(
      "================================="
    );

  } catch (err) {

    console.error(
      "Conflict Discovery Job Failed"
    );

    console.error(err);
  }
}

module.exports = updateConflicts;