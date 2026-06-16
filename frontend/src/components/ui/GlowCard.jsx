import { useState } from "react";

export default function GlowCard({
  children,
  className = "",
}) {
  const [position, setPosition] =
    useState({
      x: 50,
      y: 50,
    });

  const [hovered, setHovered] =
    useState(false);

  const handleMove = (e) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

    setPosition({
      x:
        ((e.clientX -
          rect.left) /
          rect.width) *
        100,

      y:
        ((e.clientY -
          rect.top) /
          rect.height) *
        100,
    });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      className={`
        relative
        overflow-hidden

        rounded-3xl

        border
        border-cyan-500/10

        bg-white/[0.03]

        backdrop-blur-xl

        transition-all
        duration-300

        hover:border-cyan-500/30
        hover:shadow-[0_0_35px_rgba(34,211,238,0.08)]

        ${className}
      `}
    >
      {/* Mouse Glow */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          transition-opacity
          duration-300
        "
        style={{
          opacity: hovered
            ? 1
            : 0,
          background: `
            radial-gradient(
              500px circle at
              ${position.x}%
              ${position.y}%,
              rgba(34,211,238,0.18),
              rgba(34,211,238,0.08) 20%,
              transparent 60%
            )
          `,
        }}
      />

      {/* Top Accent Glow */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
        "
        style={{
          background:
            "radial-gradient(circle at top, rgba(34,211,238,0.05), transparent 70%)",
        }}
      />

      {/* Inner Border */}
      <div
        className="
          absolute
          inset-[1px]

          rounded-3xl

          border
          border-white/[0.04]

          pointer-events-none
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}