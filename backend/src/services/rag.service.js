const Region = require("../models/Region");
const Conflict = require("../models/Conflict");
const News = require("../models/News");

async function buildContext() {
  const regions = await Region.find()
    .sort({ riskScore: -1 })
    .limit(8);

  const conflicts = await Conflict.find()
    .sort({ updatedAt: -1 })
    .limit(15);

  const news = await News.find()
    .sort({ publishedAt: -1 })
    .limit(15);

  return `
REGIONAL RISK SCORES

${regions.map(
  (r) => `
Region: ${r.name}
Risk Score: ${r.riskScore}
Active Conflicts: ${r.activeConflicts}
Assessment:
${r.assessment || ""}
`
).join("\n")}

ACTIVE CONFLICTS

${conflicts.map(
  (c) => `
Conflict: ${c.name}
Region: ${c.region}
Severity: ${c.severity}
Status: ${c.status}
Summary:
${c.summary || ""}
`
).join("\n")}

LATEST NEWS

${news.map(
  (n) => `
${n.title}

${n.description || ""}
`
).join("\n")}
`;
}

module.exports = {
  buildContext,
};