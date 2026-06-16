import { useEffect, useState } from "react";

import StatCard from "../components/dashboard/StatCard";
import IntelligenceMap from "../components/map/IntelligenceMap";
import GlowCard from "../components/ui/GlowCard";

import {
  getDashboardStats,
} from "../services/dashboardService";

export default function Dashboard() {
  const [stats, setStats] =
    useState({
      activeConflicts: 0,
      threatIndex: 0,
      alerts: 0,
      forecastAccuracy: 0,
    });

  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const data =
            await getDashboardStats();

          setStats(data);
        } catch (error) {
          console.error(
            "Failed to load dashboard stats:",
            error
          );
        }
      };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}

      <div className="mb-12">
        <p
          className="
          text-xs

          uppercase

          tracking-[0.35em]

          text-cyan-400
          "
        >
          Global Intelligence Overview
        </p>

        <h1
          className="
          mt-3

          text-5xl

          font-black

          text-white

          leading-tight
          "
        >
          Strategic
          <br />
          Intelligence
          <br />
          Dashboard
        </h1>

        <p
          className="
          mt-5

          max-w-3xl

          text-slate-400
          text-lg
          "
        >
          Monitor geopolitical risk,
          active conflicts,
          strategic forecasts,
          and regional intelligence
          in real time.
        </p>
      </div>

      {/* Stat Cards */}

      <div
        className="
        grid

        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4

        gap-6
        "
      >
        <StatCard
          title="Active Conflicts"
          value={
            stats.activeConflicts
          }
          color="text-red-400"
        />

        <StatCard
          title="Threat Index"
          value={
            stats.threatIndex
          }
          color="text-cyan-300"
        />

        <StatCard
          title="Alerts"
          value={stats.alerts}
          color="text-yellow-400"
        />

        <StatCard
          title="Forecast Accuracy"
          value={`${stats.forecastAccuracy}%`}
          color="text-green-400"
        />
      </div>

      {/* Situation Overview */}

      <GlowCard
        className="
        mt-8
        p-6
        "
      >
        <h2
          className="
          text-xl

          font-semibold

          text-cyan-300

          mb-4
          "
        >
          Situation Overview
        </h2>

        <p
  className="
  text-slate-400

  leading-relaxed

  text-base
  md:text-lg

  max-w-4xl
  "
>
          Monitor conflict zones,
          sanctions,
          military deployments,
          diplomatic developments,
          intelligence signals,
          and strategic risks
          across the globe
          in real time.
        </p>
      </GlowCard>

      {/* Intelligence Map */}

      <GlowCard
        className="
        mt-8
        p-8
        "
      >
        <h2
          className="
          text-2xl

          font-semibold

          text-cyan-300

          mb-6
          "
        >
          Global Intelligence Map
        </h2>

        <IntelligenceMap />
      </GlowCard>
    </div>
  );
}