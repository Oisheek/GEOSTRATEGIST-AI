import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "../services/api";

export default function RegionDetails() {

  const { id } =
    useParams();

  const [region, setRegion] =
    useState(null);

  const [news, setNews] =
    useState([]);

  const [
    assessment,
    setAssessment
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchRegion();
  }, []);

  const fetchRegion =
    async () => {

      try {

        const response =
          await api.get(
            `/regions/${id}`
          );

        setRegion(
          response.data
        );

        setAssessment(
          response.data
            .assessment || ""
        );

        const newsResponse =
          await api.get(
            `/news/region/${response.data.name}`
          );

        setNews(
          newsResponse.data
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

  if (
    loading ||
    !region
  ) {
    return (
      <div className="p-8 text-white">
        Loading region...
      </div>
    );
  }

  const riskColor =
    region.riskScore >= 75
      ? "text-red-400"
      : region.riskScore >= 50
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="p-8">

      <div className="mb-8">

        <h1
          className="
          text-5xl
          font-bold
          text-white
          "
        >
          {region.name}
        </h1>

        <p className="text-slate-400 mt-3">
          {region.summary}
        </p>

      </div>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        "
      >

        <div
          className="
          bg-[#161B2B]
          border
          border-[#2A3147]
          rounded-2xl
          p-6
          "
        >
          <p className="text-slate-500">
            Risk Score
          </p>

          <h2
            className={`text-5xl font-bold mt-3 ${riskColor}`}
          >
            {region.riskScore}
          </h2>
        </div>

        <div
          className="
          bg-[#161B2B]
          border
          border-[#2A3147]
          rounded-2xl
          p-6
          "
        >
          <p className="text-slate-500">
            Active Conflicts
          </p>

          <h2
            className="
            text-5xl
            font-bold
            text-white
            mt-3
            "
          >
            {region.activeConflicts}
          </h2>
        </div>

        <div
          className="
          bg-[#161B2B]
          border
          border-[#2A3147]
          rounded-2xl
          p-6
          "
        >
          <p className="text-slate-500">
            News Articles
          </p>

          <h2
            className="
            text-5xl
            font-bold
            text-cyan-400
            mt-3
            "
          >
            {region.newsCount}
          </h2>
        </div>

      </div>

      <div
        className="
        mt-8
        bg-[#161B2B]
        border
        border-[#2A3147]
        rounded-2xl
        p-8
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          text-white
          mb-6
          "
        >
          Forecast Analysis
        </h2>

        <div className="space-y-5">

          <div>

            <div className="flex justify-between mb-2">

              <span className="text-red-400">
                Escalation
              </span>

              <span className="text-white">
                {region.forecast.escalation}%
              </span>

            </div>

            <div className="h-3 bg-slate-800 rounded-full">

              <div
                className="
                h-full
                bg-red-500
                rounded-full
                "
                style={{
                  width:
                    `${region.forecast.escalation}%`,
                }}
              />

            </div>

          </div>

          <div>

            <div className="flex justify-between mb-2">

              <span className="text-green-400">
                Stability
              </span>

              <span className="text-white">
                {region.forecast.stability}%
              </span>

            </div>

            <div className="h-3 bg-slate-800 rounded-full">

              <div
                className="
                h-full
                bg-green-500
                rounded-full
                "
                style={{
                  width:
                    `${region.forecast.stability}%`,
                }}
              />

            </div>

          </div>

          <div>

            <div className="flex justify-between mb-2">

              <span className="text-cyan-400">
                De-escalation
              </span>

              <span className="text-white">
                {region.forecast.deEscalation}%
              </span>

            </div>

            <div className="h-3 bg-slate-800 rounded-full">

              <div
                className="
                h-full
                bg-cyan-500
                rounded-full
                "
                style={{
                  width:
                    `${region.forecast.deEscalation}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      <div
        className="
        mt-8
        bg-[#161B2B]
        border
        border-[#2A3147]
        rounded-2xl
        p-8
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          text-white
          mb-6
          "
        >
          Latest Regional News
        </h2>

        {
          news.length === 0 ? (
            <p className="text-slate-500">
              No news available for this region.
            </p>
          ) : (
            <div className="space-y-4">

              {news.map(
                (article) => (

                  <a
                    key={article._id}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="
                    block
                    border
                    border-slate-700
                    rounded-xl
                    p-4
                    hover:border-cyan-400
                    transition-all
                    "
                  >

                    <h3
                      className="
                      text-white
                      font-semibold
                      "
                    >
                      {article.title}
                    </h3>

                    {article.description && (
                      <p
                        className="
                        text-slate-400
                        text-sm
                        mt-2
                        "
                      >
                        {article.description}
                      </p>
                    )}

                    <div
                      className="
                      flex
                      justify-between
                      items-center
                      mt-3
                      "
                    >

                      <span
                        className="
                        text-cyan-400
                        text-xs
                        "
                      >
                        {
                          article.source ||
                          "Unknown Source"
                        }
                      </span>

                      <span
                        className="
                        text-slate-500
                        text-xs
                        "
                      >
                        {new Date(
                          article.publishedAt
                        ).toLocaleString()}
                      </span>

                    </div>

                  </a>

                )
              )}

            </div>
          )
        }

      </div>

      <div
        className="
        mt-8
        bg-[#161B2B]
        border
        border-[#2A3147]
        rounded-2xl
        p-8
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          text-white
          mb-6
          "
        >
          AI Regional Assessment
        </h2>

        <p
          className="
          text-slate-300
          leading-relaxed
          whitespace-pre-wrap
          "
        >
          {
            assessment ||
            "Generating assessment..."
          }
        </p>

        {
          region.assessmentUpdatedAt && (
            <div
              className="
              mt-4
              text-xs
              text-slate-500
              "
            >
              Updated:
              {" "}
              {new Date(
                region.assessmentUpdatedAt
              ).toLocaleString()}
            </div>
          )
        }

      </div>

    </div>
  );
}