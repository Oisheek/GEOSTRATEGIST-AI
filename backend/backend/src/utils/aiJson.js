function stripCodeFences(text = "") {
  return String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function extractJsonObject(text = "") {
  const cleaned = stripCodeFences(text);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return cleaned.slice(start, end + 1);
}

function parseJsonObject(text = "", fallback = null) {
  try {
    const json = extractJsonObject(text);
    if (!json) return fallback;
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

module.exports = {
  stripCodeFences,
  extractJsonObject,
  parseJsonObject,
};