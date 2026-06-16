import { useEffect, useState } from "react";
import api from "../services/api";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("all");
  const [region, setRegion] = useState("all");

  const cleanText = (text) => {
    if (!text) return "";

    return text
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#8217;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get("/news");
      setNews(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (region) => {
    const highRisk = ["Middle East", "East Asia"];

    const mediumRisk = [
      "Europe",
      "Africa",
      "South Asia",
    ];

    if (highRisk.includes(region)) {
      return {
        label: "HIGH RISK",
        className:
          "bg-red-500/10 text-red-400",
      };
    }

    if (mediumRisk.includes(region)) {
      return {
        label: "MEDIUM RISK",
        className:
          "bg-yellow-500/10 text-yellow-400",
      };
    }

    return {
      label: "LOW RISK",
      className:
        "bg-green-500/10 text-green-400",
    };
  };

  const filteredNews = news.filter(
    (article) => {
      const matchesSearch =
        article.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        article.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      let matchesLanguage = true;

      if (language === "english") {
        matchesLanguage =
          /^[\x00-\x7F]*$/.test(
            article.title
          );
      }

      if (
        language ===
        "non-english"
      ) {
        matchesLanguage =
          !/^[\x00-\x7F]*$/.test(
            article.title
          );
      }

      const matchesRegion =
        region === "all"
          ? true
          : article.region ===
            region;

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesRegion
      );
    }
  );

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading news...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 overflow-x-hidden">
      <h1
        className="
        text-3xl
        md:text-5xl
        font-bold
        mb-8
        bg-gradient-to-r
        from-violet-400
        via-fuchsia-400
        to-cyan-400
        bg-clip-text
        text-transparent
        "
      >
        Global News Feed
      </h1>

      <div
        className="
        flex
        flex-col
        lg:flex-row
        gap-4
        mb-8
        "
      >
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
          px-4
          py-3
          rounded-xl
          bg-[#161B2B]
          border
          border-violet-500/20
          text-white
          w-full
          lg:w-96
          "
        />

        <select
          value={region}
          onChange={(e) =>
            setRegion(
              e.target.value
            )
          }
          className="
          px-4
          py-3
          rounded-xl
          bg-[#161B2B]
          border
          border-violet-500/20
          text-white
          "
        >
          <option value="all">
            All Regions
          </option>
          <option value="North America">
            North America
          </option>
          <option value="South America">
            South America
          </option>
          <option value="Europe">
            Europe
          </option>
          <option value="Africa">
            Africa
          </option>
          <option value="Middle East">
            Middle East
          </option>
          <option value="South Asia">
            South Asia
          </option>
          <option value="East Asia">
            East Asia
          </option>
          <option value="Oceania">
            Oceania
          </option>
        </select>

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
          className="
          px-4
          py-3
          rounded-xl
          bg-[#161B2B]
          border
          border-violet-500/20
          text-white
          "
        >
          <option value="all">
            All Languages
          </option>

          <option value="english">
            English
          </option>

          <option value="non-english">
            Non-English
          </option>
        </select>
      </div>

      <div className="mb-4 text-slate-400">
        Showing {filteredNews.length} articles
      </div>

      <div className="grid gap-6">
        {filteredNews.map(
          (article) => (
            <div
              key={article._id}
              className="
              bg-[#0F172A]/70
              backdrop-blur-xl
              border
              border-violet-500/20
              rounded-3xl
              p-6
              hover:border-cyan-400/40
              transition-all
              overflow-hidden
              max-w-full
              "
            >
              <h2
                className="
                text-xl
                font-bold
                text-white
                break-words
                leading-relaxed
                overflow-hidden
                "
              >
                {cleanText(
                  article.title
                )}
              </h2>

              {article.description && (
                <p
                  className="
                  text-slate-400
                  mt-3
                  break-words
                  leading-relaxed
                  overflow-hidden
                  "
                >
                  {cleanText(
                    article.description
                  )}
                </p>
              )}

              <div
                className="
                flex
                flex-wrap
                gap-4
                mt-4
                text-sm
                "
              >
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      ${
                        getRiskLevel(
                          article.region
                        ).className
                      }
                    `}
                  >
                    {
                      getRiskLevel(
                        article.region
                      ).label
                    }
                  </span>

                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-cyan-500/10
                    text-cyan-400
                    "
                  >
                    {article.region}
                  </span>
                </div>

                {article.source && (
                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-yellow-500/10
                    text-yellow-400
                    "
                  >
                    {article.source}
                  </span>
                )}

                <span className="text-slate-500 break-all">
                  {new Date(
                    article.publishedAt
                  ).toLocaleString()}
                </span>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="
                inline-block
                mt-4
                text-violet-400
                hover:text-cyan-400
                transition-colors
                break-all
                "
              >
                Read Article →
              </a>
            </div>
          )
        )}
      </div>

      {filteredNews.length === 0 && (
        <div
          className="
          mt-12
          text-center
          text-slate-500
          "
        >
          No articles found.
        </div>
      )}
    </div>
  );
}