import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Regions() {
  const [regions, setRegions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response =
        await api.get("/regions");

      setRegions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (
    score
  ) => {
    if (score >= 75)
      return "text-red-400";

    if (score >= 50)
      return "text-yellow-400";

    return "text-green-400";
  };

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading regions...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="mb-8">

        <h1
          className="
          text-4xl
          font-bold
          text-white
          "
        >
          Regional Intelligence
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor geopolitical risk,
          conflicts and forecasts across
          major world regions.
        </p>

      </div>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
        "
      >
        {regions.map((region) => (
          <Link
            key={region._id}
            to={`/regions/${region._id}`}
            className="
            block
            bg-[#161B2B]
            border
            border-[#2A3147]
            rounded-xl
            p-6
            hover:border-cyan-400
            transition-all
            "
          >
            <div className="flex justify-between items-start">

              <div>

                <h2
                  className="
                  text-2xl
                  font-semibold
                  text-white
                  "
                >
                  {region.name}
                </h2>

                <p
                  className="
                  text-slate-400
                  text-sm
                  mt-2
                  "
                >
                  {region.summary}
                </p>

              </div>

            </div>

            <div className="mt-6">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Risk Score
                </span>

                <span
                  className={`font-bold ${getRiskColor(
                    region.riskScore
                  )}`}
                >
                  {region.riskScore}
                </span>

              </div>

              <div className="flex justify-between mt-2">

                <span className="text-slate-500">
                  Active Conflicts
                </span>

                <span className="text-white">
                  {region.activeConflicts}
                </span>

              </div>

            </div>

          </Link>
        ))}
      </div>

    </div>
  );
}