import { Link } from "react-router-dom";

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-black flex justify-around py-3">

      <Link to="/dashboard">
        Dashboard
      </Link>

      <Link to="/countries">
        Countries
      </Link>

      <Link to="/news">
        News
      </Link>

    </nav>
  );
}