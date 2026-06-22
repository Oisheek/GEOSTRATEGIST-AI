const axios = require("axios");

const REQUEST_TIMEOUT_MS = 20000;
const NEWS_QUERY =
  "war conflict attack missile military protest sanctions invasion ceasefire airstrike bombing drone";

function logAxiosError(prefix, err) {
  console.log(`${prefix} ERROR STATUS:`, err.response?.status);
  console.log(`${prefix} ERROR DATA:`);
  console.log(err.response?.data);
  console.log(`${prefix} ERROR MESSAGE:`, err.message);
}

function normalizeUrl(url) {
  return typeof url === "string" ? url.trim() : "";
}

function normalizeSource(source) {
  if (!source) return "";
  if (typeof source === "string") return source.trim();
  if (typeof source === "object") {
    return (
      source.name ||
      source.title ||
      source.source ||
      source.id ||
      ""
    )
      .toString()
      .trim();
  }
  return "";
}

function normalizePublishedAt(value) {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function normalizeArticle(article) {
  if (!article || typeof article !== "object") return null;

  const title = String(article.title || article.headline || "").trim();
  const description = String(
    article.description ||
      article.summary ||
      article.text ||
      article.content ||
      ""
  ).trim();

  const url = normalizeUrl(article.url || article.link || article.source_url);
  if (!title || !url) return null;

  return {
    title,
    description,
    url,
    source: normalizeSource(article.source),
    publishedAt: normalizePublishedAt(
      article.publish_date ||
        article.pubDate ||
        article.publishedAt ||
        article.published_at
    ),
  };
}

function normalizeArticles(data) {
  const items =
    data?.news ||
    data?.headlines ||
    data?.articles ||
    data?.results ||
    [];

  if (!Array.isArray(items)) return [];

  return items.map(normalizeArticle).filter(Boolean);
}

exports.fetchWorldNews = async function () {
  try {
    const response = await axios.get(
      "https://api.worldnewsapi.com/search-news",
      {
        params: {
          "api-key": process.env.WORLDNEWS_API_KEY,
          text: NEWS_QUERY,
          language: "en",
          number: 50,
        },
        timeout: REQUEST_TIMEOUT_MS,
      }
    );

    return normalizeArticles(response.data);
  } catch (err) {
    logAxiosError("WORLDNEWS", err);
    return [];
  }
};

exports.fetchHeadlineFeed = async function () {
  try {
    const response = await axios.post(
      "https://api.headlinefeed.dev/api/search",
      {
        title: NEWS_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HEADLINEFEED_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: REQUEST_TIMEOUT_MS,
      }
    );

    return normalizeArticles(response.data);
  } catch (err) {
    logAxiosError("HEADLINEFEED", err);
    return [];
  }
};