import GlowCard from "../ui/GlowCard";

export default function StatCard({
  title,
  value,
  color,
}) {
  return (
    <GlowCard
      className="p-6"
    >
      <p
        className="
        text-[11px]
        uppercase
        tracking-[0.25em]
        text-slate-500
        "
      >
        {title}
      </p>

      <h2
        className={`
        mt-4
        text-5xl
        font-black
        ${color}
        `}
      >
        {value}
      </h2>
    </GlowCard>
  );
}