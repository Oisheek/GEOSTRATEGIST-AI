import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

export default function Conflicts() {

  const [conflicts, setConflicts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts =
    async () => {

      try {

        const response =
          await api.get(
            "/conflicts"
          );

        setConflicts(
          response.data
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

  const getSeverityColor =
    (severity) => {

      switch (
        severity
      ) {

        case "Critical":
          return "text-red-400";

        case "High":
          return "text-orange-400";

        case "Medium":
          return "text-yellow-400";

        default:
          return "text-green-400";
      }
    };

  if (loading) {

    return (
      <div className="p-8 text-white">
        Loading conflicts...
      </div>
    );

  }

  return (
    <div className="p-8">

      <h1
        className="
        text-5xl
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
        Conflict Tracker
      </h1>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
        "
      >

        {conflicts.map(
          (conflict) => (

            <div
              key={
                conflict._id
              }
              className="
              bg-[#161B2B]
              border
              border-[#2A3147]
              rounded-2xl
              p-6
              "
            >

              <div
                className="
                flex
                justify-between
                items-start
                "
              >

                <h2
                  className="
                  text-2xl
                  font-bold
                  text-white
                  "
                >
                  {
                    conflict.name
                  }
                </h2>

                <span
                  className={`font-semibold ${getSeverityColor(
                    conflict.severity
                  )}`}
                >
                  {
                    conflict.severity
                  }
                </span>

              </div>

              <p
                className="
                text-slate-400
                mt-3
                "
              >
                {
                  conflict.summary
                }
              </p>

              <div
                className="
                mt-5
                space-y-2
                "
              >

                <p className="text-cyan-400">
                  Region:
                  {" "}
                  {
                    conflict.region
                  }
                </p>

                <p className="text-slate-300">
                  Status:
                  {" "}
                  {
                    conflict.status
                  }
                </p>

                <p className="text-slate-300">
                  Actors:
                  {" "}
                  {
                    conflict.actors.join(
                      ", "
                    )
                  }
                </p>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}