const {
  callOpenRouterChat,
  extractContent,
} = require("../utils/openrouter.service");

const {
  parseJsonObject,
} = require("../utils/aiJson");

const MODEL =
  "openai/gpt-oss-120b:free";

function normalizeText(value, fallback = "") {
  const text = String(value || fallback)
    .replace(/```/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
}

function normalizeConflictKey(name) {
  const n = normalizeText(name, "")
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!n) return "";

  if (
    (n.includes("russia") && n.includes("ukraine")) ||
    (n.includes("ukraine") && n.includes("russia"))
  ) {
    return "russia-ukraine-war";
  }

  if (
    (n.includes("belarus") && n.includes("ukraine")) ||
    n.includes("signal relay")
  ) {
    return "belarus-ukraine-tensions";
  }

  if (
    n.includes("cross strait") ||
    n.includes("cross-strait") ||
    n.includes("taiwan strait") ||
    (n.includes("taiwan") && n.includes("china"))
  ) {
    return "taiwan-strait-tensions";
  }

  if (n.includes("israel") && n.includes("gaza")) {
    return "israel-gaza-conflict";
  }

  if (n.includes("israel") && n.includes("lebanon")) {
    return "israel-lebanon-conflict";
  }

  if (
    (n.includes("us") ||
      n.includes("u s") ||
      n.includes("u.s.") ||
      n.includes("united states")) &&
    n.includes("iran")
  ) {
    return "us-iran-tensions";
  }

  if (
    (n.includes("india") && n.includes("pakistan")) ||
    n.includes("kashmir") ||
    n.includes("jammu and kashmir")
  ) {
    return "india-pakistan-tensions";
  }

  if (n.includes("sudan")) return "sudan-conflict";
  if (n.includes("myanmar")) return "myanmar-civil-war";
  if (n.includes("dr congo") || n.includes("congo")) return "dr-congo-conflict";
  if (n.includes("yemen")) return "yemen-conflict";
  if (n.includes("syria")) return "syria-conflict";

  if (n.includes("armenia") && n.includes("azerbaijan")) {
    return "armenia-azerbaijan-tensions";
  }

  if (n.includes("north korea") && n.includes("south korea")) {
    return "north-korea-south-korea-tensions";
  }

  if (n.includes("cyprus")) return "cyprus-dispute";

  if (
    n.includes("china") &&
    (n.includes("rare earth") ||
      n.includes("trade tension") ||
      n.includes("trade tensions") ||
      n.includes("trade standoff"))
  ) {
    return "china-us-trade-tension";
  }

  return n
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

function severityRank(value) {
  const map = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };
  return map[value] || 2;
}

function statusRank(value) {
  const map = {
    Monitoring: 1,
    Active: 2,
    Escalating: 3,
    Resolved: 0,
  };
  return map[value] ?? 1;
}

function pickBetterConflict(existing, candidate) {
  if (!existing) return candidate;
  if (!candidate) return existing;

  const existingSeverity = severityRank(existing.severity);
  const candidateSeverity = severityRank(candidate.severity);

  if (candidateSeverity > existingSeverity) {
    return candidate;
  }

  if (candidateSeverity < existingSeverity) {
    return existing;
  }

  const existingStatus = statusRank(existing.status);
  const candidateStatus = statusRank(candidate.status);

  if (candidateStatus > existingStatus) {
    return candidate;
  }

  return existing;
}

function isBlockedConflict(text) {
  const t = normalizeText(text, "").toLowerCase();

  const blockedKeywords = [
    "shiv sena",
    "party split",
    "faction split",
    "factional",
    "power struggle",
    "political party",
    "coalition crisis",
    "election",
    "electoral",
    "vote",
    "campaign",
    "parliament",
    "cabinet",
    "government reshuffle",
    "wildfire",
    "bushfire",
    "forest fire",
    "school shooting",
    "shooting",
    "bomb scare",
    "suspected explosive device",
    "explosion",
    "cyberattack",
    "cyber attack",
    "cybercrime",
    "hack",
    "hacked",
    "hacker",
    "breach",
    "data breach",
    "protest",
    "demonstration",
    "riot",
    "unrest",
    "street unrest",
    "health",
    "medical",
    "bird flu",
    "ebola",
    "covid",
    "hantavirus",
    "weather",
    "heatwave",
    "storm",
    "flood",
    "sports",
    "celebrity",
    "business",
    "stock",
    "market",
    "court case",
    "lawsuit",
    "crime",
    "criminal",
    "murder",
    "robbery",
    "pharma",
    "drug",
    "trade dispute",
    "economic dispute",
  ];

  return blockedKeywords.some((term) => t.includes(term));
}

function hasGeopoliticalSignal(text) {
  const t = normalizeText(text, "").toLowerCase();

  const strongSignals = [
    "war",
    "conflict",
    "armed conflict",
    "invasion",
    "ceasefire",
    "airstrike",
    "air strike",
    "missile",
    "rocket",
    "drone",
    "drone strike",
    "shelling",
    "border clash",
    "border",
    "territorial",
    "insurgency",
    "civil war",
    "military",
    "military operation",
    "military drill",
    "military exercise",
    "troop",
    "troops",
    "blockade",
    "naval",
    "maritime",
    "proxy",
    "occupation",
    "annexation",
    "skirmish",
    "hostilities",
    "cease-fire",
    "escalation",
    "escalating",
    "standoff",
    "tension",
    "tensions",
    "armed",
  ];

  return strongSignals.some((term) => t.includes(term));
}

function looksLikeRealConflict(conflict) {
  const text = [
    conflict?.name,
    conflict?.summary,
    conflict?.region,
    Array.isArray(conflict?.actors)
      ? conflict.actors.join(" ")
      : conflict?.actors,
  ]
    .filter(Boolean)
    .join(" ");

  if (!text.trim()) return false;
  if (isBlockedConflict(text)) return false;
  if (!hasGeopoliticalSignal(text)) return false;

  const t = text.toLowerCase();

  const regionHints = [
    "israel",
    "iran",
    "russia",
    "ukraine",
    "china",
    "taiwan",
    "india",
    "pakistan",
    "lebanon",
    "syria",
    "yemen",
    "sudan",
    "congo",
    "myanmar",
    "north korea",
    "south korea",
    "gaza",
    "belarus",
    "armenia",
    "azerbaijan",
    "us",
    "u.s.",
    "united states",
    "europe",
    "middle east",
    "south asia",
    "east asia",
    "africa",
  ];

  const hasActorOrGeoContext =
    regionHints.some((hint) => t.includes(hint)) ||
    (Array.isArray(conflict?.actors) && conflict.actors.length > 0);

  return hasActorOrGeoContext;
}

function shouldKeepConflict(conflict) {
  if (!conflict || !conflict.name) return false;
  return looksLikeRealConflict(conflict);
}

const CONFLICT_COORDINATES = {
  "russia-ukraine-war": { lat: 49, lng: 32 },
  "israel-gaza-conflict": { lat: 31.5, lng: 34.5 },
  "israel-lebanon-conflict": { lat: 33.8, lng: 35.8 },
  "us-iran-tensions": { lat: 32, lng: 53 },
  "taiwan-strait-tensions": { lat: 24, lng: 121 },
  "india-pakistan-tensions": { lat: 34, lng: 69 },
  "sudan-conflict": { lat: 15.5, lng: 32.5 },
  "south-china-sea-dispute": { lat: 15, lng: 115 },
  "dr-congo-conflict": { lat: -2, lng: 23 },
  "yemen-conflict": { lat: 15, lng: 48 },
  "syria-conflict": { lat: 35, lng: 38 },
  "myanmar-civil-war": { lat: 21, lng: 96 },
  "armenia-azerbaijan-tensions": { lat: 40.3, lng: 47.7 },
  "north-korea-south-korea-tensions": { lat: 38, lng: 127 },
  "belarus-ukraine-tensions": { lat: 50, lng: 30 },
  "cyprus-dispute": { lat: 35.1, lng: 33.3 },
  "china-us-trade-tension": { lat: 39.9, lng: 116.4 },
};

const REGION_COORDINATES = {
  "north america": { lat: 39.8283, lng: -98.5795 },
  "south america": { lat: -15.7939, lng: -47.8828 },
  europe: { lat: 54.526, lng: 15.2551 },
  africa: { lat: 1.6508, lng: 17.0 },
  "middle east": { lat: 29.5, lng: 45.5 },
  "south asia": { lat: 22.5, lng: 79.5 },
  "east asia": { lat: 35.0, lng: 104.0 },
  oceania: { lat: -22.0, lng: 140.0 },
  global: { lat: 20.0, lng: 0.0 },
};

function resolveConflictCoordinates(conflict) {
  const name = normalizeText(conflict?.name, "");
  const summary = normalizeText(conflict?.summary, "");
  const region = normalizeText(conflict?.region, "");
  const actors = Array.isArray(conflict?.actors)
    ? conflict.actors.join(" ")
    : normalizeText(conflict?.actors, "");

  const text = `${name} ${summary} ${region} ${actors}`
    .toLowerCase()
    .trim();

  const normalizedKey = normalizeConflictKey(name);
  if (normalizedKey && CONFLICT_COORDINATES[normalizedKey]) {
    return {
      ...CONFLICT_COORDINATES[normalizedKey],
      locationSource: `key:${normalizedKey}`,
    };
  }

  const regionKey = normalizeText(region, "").toLowerCase();
  if (regionKey && REGION_COORDINATES[regionKey]) {
    return {
      ...REGION_COORDINATES[regionKey],
      locationSource: `region:${regionKey}`,
    };
  }

  if (
    text.includes("cross-strait") ||
    text.includes("taiwan strait") ||
    (text.includes("taiwan") && text.includes("china"))
  ) {
    return {
      lat: 24,
      lng: 121,
      locationSource: "heuristic:taiwan-strait",
    };
  }

  if (
    (text.includes("russia") && text.includes("ukraine")) ||
    text.includes("signal relay")
  ) {
    return {
      lat: 49,
      lng: 32,
      locationSource: "heuristic:russia-ukraine",
    };
  }

  if (text.includes("israel") && text.includes("gaza")) {
    return {
      lat: 31.5,
      lng: 34.5,
      locationSource: "heuristic:israel-gaza",
    };
  }

  if (text.includes("israel") && text.includes("lebanon")) {
    return {
      lat: 33.8,
      lng: 35.8,
      locationSource: "heuristic:israel-lebanon",
    };
  }

  if (
    (text.includes("us") ||
      text.includes("u.s.") ||
      text.includes("united states")) &&
    text.includes("iran")
  ) {
    return {
      lat: 32,
      lng: 53,
      locationSource: "heuristic:us-iran",
    };
  }

  if (
    (text.includes("india") && text.includes("pakistan")) ||
    text.includes("kashmir") ||
    text.includes("jammu and kashmir")
  ) {
    return {
      lat: 34,
      lng: 69,
      locationSource: "heuristic:india-pakistan",
    };
  }

  if (text.includes("sudan")) {
    return {
      lat: 15.5,
      lng: 32.5,
      locationSource: "heuristic:sudan",
    };
  }

  if (text.includes("myanmar")) {
    return {
      lat: 21,
      lng: 96,
      locationSource: "heuristic:myanmar",
    };
  }

  if (text.includes("congo")) {
    return {
      lat: -2,
      lng: 23,
      locationSource: "heuristic:congo",
    };
  }

  if (text.includes("yemen")) {
    return {
      lat: 15,
      lng: 48,
      locationSource: "heuristic:yemen",
    };
  }

  if (text.includes("syria")) {
    return {
      lat: 35,
      lng: 38,
      locationSource: "heuristic:syria",
    };
  }

  if (text.includes("armenia") && text.includes("azerbaijan")) {
    return {
      lat: 40.3,
      lng: 47.7,
      locationSource: "heuristic:armenia-azerbaijan",
    };
  }

  if (text.includes("north korea") && text.includes("south korea")) {
    return {
      lat: 38,
      lng: 127,
      locationSource: "heuristic:koreas",
    };
  }

  if (text.includes("cyprus")) {
    return {
      lat: 35.1,
      lng: 33.3,
      locationSource: "heuristic:cyprus",
    };
  }

  if (text.includes("rare earth") && text.includes("china")) {
    return {
      lat: 39.9,
      lng: 116.4,
      locationSource: "heuristic:china-us-trade",
    };
  }

  if (regionKey && REGION_COORDINATES[regionKey]) {
    return {
      ...REGION_COORDINATES[regionKey],
      locationSource: `region:${regionKey}`,
    };
  }

  return {
    ...REGION_COORDINATES.global,
    locationSource: "fallback:global",
  };
}

async function discoverConflicts(news) {
  try {
    const headlines = (news || [])
      .slice(0, 20)
      .map(
        (n) =>
          `- ${normalizeText(
            n.title || "",
            ""
          )}${
            n.description
              ? ` — ${normalizeText(
                  n.description,
                  ""
                )}`
              : ""
          }`
      )
      .join("\n");

    const prompt = `
You are a senior geopolitical intelligence analyst.

Your job is to identify ONLY active geopolitical conflicts, interstate tensions, territorial disputes, military escalations, border crises, civil wars, insurgencies, ceasefire violations, proxy conflicts, maritime disputes, and nuclear/security confrontations.

Strict rules:
- Return ONLY real geopolitical conflict items.
- Exclude domestic politics, party splits, elections, protests without sustained conflict, cyber incidents, crimes, accidents, health events, weather, wildfires, school shootings, business news, and celebrity/news-of-the-day items.
- If the story is a one-off incident without an ongoing geopolitical conflict or state-on-state / state-vs-insurgent context, DO NOT include it.
- Prefer only items with clear evidence of sustained conflict, active military posture, armed clashes, or territorial dispute.
- Merge duplicates.
- Return unique conflicts only.
- Use the exact region labels from this list only: North America, South America, Europe, Africa, Middle East, South Asia, East Asia, Oceania.
- severity must be Low, Medium, High, or Critical.
- status must be Monitoring, Active, Escalating, or Resolved.
- If uncertain, omit the item.

Return valid JSON only in this shape:
{
  "conflicts": [
    {
      "name": "",
      "region": "",
      "severity": "Low",
      "status": "Monitoring",
      "summary": "",
      "actors": []
    }
  ]
}

Headlines:
${headlines}
`;

    const response = await callOpenRouterChat({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      maxRetries: 2,
    });

    const content = extractContent(response);
    const parsed = parseJsonObject(content, null);

    if (!parsed) {
      console.log("Invalid JSON from conflict discovery AI call");
      console.log(content);
      return [];
    }

    const conflicts = Array.isArray(parsed.conflicts)
      ? parsed.conflicts
      : Array.isArray(parsed)
        ? parsed
        : [];

    const deduped = new Map();

    for (const conflict of conflicts) {
      if (!conflict || !conflict.name) continue;

      const name = normalizeText(conflict.name, "");
      const key = normalizeConflictKey(name);
      if (!key) continue;

      const normalizedConflict = {
        ...conflict,
        name,
        normalizedKey: key,
        region: normalizeText(conflict.region, "Global"),
        severity: ["Low", "Medium", "High", "Critical"].includes(conflict.severity)
          ? conflict.severity
          : "Medium",
        status: ["Monitoring", "Active", "Escalating", "Resolved"].includes(conflict.status)
          ? conflict.status
          : "Monitoring",
        summary: normalizeText(conflict.summary, ""),
        actors: Array.isArray(conflict.actors) ? conflict.actors : [],
      };

      if (!shouldKeepConflict(normalizedConflict)) {
        continue;
      }

      const coords = resolveConflictCoordinates(normalizedConflict);
      normalizedConflict.lat = coords.lat;
      normalizedConflict.lng = coords.lng;
      normalizedConflict.coordinates = [coords.lat, coords.lng];
      normalizedConflict.locationSource = coords.locationSource;

      const existing = deduped.get(key);
      deduped.set(key, pickBetterConflict(existing, normalizedConflict));
    }

    return Array.from(deduped.values());
  } catch (err) {
    console.error("Conflict Discovery Failed");
    console.error(
      err?.originalError?.error?.message ||
        err?.originalError?.message ||
        err?.response?.data ||
        err?.message
    );
    return [];
  }
}

module.exports = {
  discoverConflicts,
  normalizeConflictKey,
  shouldKeepConflict,
};