import { Link } from "react-router-dom";

const links = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Countries", path: "/countries" },
  { label: "News", path: "/news" },
  { label: "Conflicts", path: "/conflicts" },
  { label: "Forecasts", path: "/forecasts" },
  { label: "Reports", path: "/reports" }
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r flex-col">
      <div className="p-4 text-xl font-bold">
        GeoStrategist AI
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}