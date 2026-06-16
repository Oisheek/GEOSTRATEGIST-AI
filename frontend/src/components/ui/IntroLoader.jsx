import { useEffect, useState } from "react";

const messages = [
  "Connecting to Intelligence Network",
  "Loading Conflict Database",
  "Synchronizing Regional Intelligence",
  "Calibrating Forecast Engine",
  "Authenticating Access",
];

export default function IntroLoader({
  onComplete,
}) {
  const [progress, setProgress] =
    useState(0);

  const [stage, setStage] =
    useState(0);

  const [granted, setGranted] =
    useState(false);

  useEffect(() => {
    const timer =
      setInterval(() => {
        setProgress((prev) => {
          const next =
            prev + Math.random() * 4;

          if (next >= 100) {
            clearInterval(timer);

            setProgress(100);

            setGranted(true);

            setTimeout(() => {
              onComplete();
            }, 1200);

            return 100;
          }

          return next;
        });
      }, 80);

    return () =>
      clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const msgTimer =
      setInterval(() => {
        setStage((prev) =>
          prev <
          messages.length - 1
            ? prev + 1
            : prev
        );
      }, 900);

    return () =>
      clearInterval(msgTimer);
  }, []);

  return (
    <div
      className="
      fixed
      inset-0
      z-[9999]

      bg-[#020617]

      overflow-hidden

      flex
      items-center
      justify-center
      "
    >
      {/* Glow */}
      <div
  className="
  absolute
  inset-0
  transition-all
  duration-500
  "
  style={{
    background: `
      radial-gradient(
        circle at center,
        rgba(
          34,
          211,
          238,
          ${0.02 + progress / 400}
        ),
        transparent 65%
      )
    `,
  }}
/>

      {/* Grid */}
      <div
        className="
        absolute
        inset-0
        opacity-[0.03]

        bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]

        bg-[size:40px_40px]
      "
      />

      <div
        className="
        relative
        text-center
        max-w-xl
        px-6
      "
      >
        <div
          className="
          text-xs
          tracking-[0.4em]
          uppercase
          text-cyan-500
          mb-4
          "
        >
          Initializing...
        </div>

        <h1
          className="
          text-6xl
          md:text-7xl
          font-black

          bg-gradient-to-r
          from-cyan-400
          via-blue-400
          to-violet-400

          bg-clip-text
          text-transparent
          "
        >
          GeoStrategist
        </h1>

        <div
          className="
          mt-12

          h-[1px]
          w-full

          bg-slate-800
          overflow-hidden
          "
        >
          <div
            className="
            h-full
            bg-cyan-500
            transition-all
            duration-200
            "
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div
          className="
          mt-4

          flex
          justify-between

          text-xs
          text-slate-500
          "
        >
          <span>
            TGE-INTEL-001
          </span>

          <span>
            {Math.floor(
              progress
            )}
            %
          </span>
        </div>

        <div
          className="
          mt-10

          text-cyan-300
          text-sm
          tracking-wider
          "
        >
          {
            messages[
              stage
            ]
          }
        </div>

        
  <div className="mt-10 space-y-3 text-sm">
  {[
    {
      label: "Conflict Monitoring",
      threshold: 25,
    },
    {
      label: "Regional Analysis",
      threshold: 50,
    },
    {
      label: "Forecast Models",
      threshold: 75,
    },
    {
      label: "Strategic Reports",
      threshold: 100,
    },
  ].map((item) => {
    const active =
      progress >=
      item.threshold;

    return (
      <div
        key={item.label}
        className={`
          flex
          items-center
          gap-3

          transition-all
          duration-1000

          ${
            active
              ? `
                text-cyan-300
                opacity-100
                drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]
              `
              : `
                text-slate-700
                opacity-30
              `
          }
        `}
      >
        <span
          className="
            w-5
            text-center
          "
        >
          {active
            ? "✓"
            : "○"}
        </span>

        <span>
          {item.label}
        </span>
      </div>
    );
  })}
</div>
        {granted && (
          <div
            className="
            mt-10

            text-cyan-400

            text-xl
            font-bold

            animate-pulse
            "
          >
            ACCESS GRANTED
          </div>
        )}
      </div>
    </div>
  );
}