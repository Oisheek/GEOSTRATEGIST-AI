import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  LogOut,
  UserCircle2,
} from "lucide-react";

import useAuthStore from "../../store/authStore";

const navItems = [
  {
    label: "Dashboard",
    to: "/",
  },
  {
    label: "Regions",
    to: "/regions",
  },
  {
    label: "News",
    to: "/news",
  },
  {
    label: "Conflicts",
    to: "/conflicts",
  },
  {
    label: "Chat",
    to: "/chat",
  },
];

export default function Topbar() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const user =
    useAuthStore(
      (state) =>
        state.user
    );

  const token =
    useAuthStore(
      (state) =>
        state.token
    );

  const logout =
    useAuthStore(
      (state) =>
        state.logout
    );

  const handleBack = () => {
  if (
    location.pathname === "/"
  ) {
    return;
  }

  navigate("/");
};

  return (
    <header
      className="
      h-18
      xl:h-20

      sticky
      top-0

      z-40

      bg-transparent
      "
    >
      <div
        className="
        h-full

        px-4
        lg:px-6

        flex
        items-center
        "
      >
        {/* Back Button */}

        <button
          type="button"
          onClick={
            handleBack
          }
          className="
            h-11
            w-11

            flex
            items-center
            justify-center

            rounded-xl

            text-slate-300

            hover:text-cyan-300

            transition
          "
        >
          <ArrowLeft
            size={18}
          />
        </button>

       <Link
  to="/"
  className="
  flex
  items-center
  gap-3

  mr-10
  "
>
  <img
    src="/logo.png"
    alt="GeoStrategist AI"
    className="
    h-10
    w-10
    object-contain
    "
  />

  <span
    className="
    text-sm

    tracking-[0.25em]

    uppercase

    text-cyan-400
    "
  >
    GEOSTRATEGIST AI
  </span>
</Link>
        {/* Navigation */}

        <nav
          className="
          ml-6

          hidden
          md:flex

          items-center

          gap-8
          "
        >
          {navItems.map(
            (item) => {
              const active =
                location.pathname ===
                item.to;

              return (
                <Link
                  key={
                    item.to
                  }
                  to={
                    item.to
                  }
                  className="
                  relative

                  py-2

                  text-sm
                  font-medium

                  transition
                  "
                >
                  <span
                    className={
                      active
                        ? "text-cyan-300"
                        : "text-slate-400 hover:text-white"
                    }
                  >
                    {
                      item.label
                    }
                  </span>

                  {active && (
                    <div
                      className="
                      absolute

                      left-0
                      right-0

                      -bottom-1

                      h-[2px]

                      rounded-full

                      bg-cyan-400
                      "
                    />
                  )}
                </Link>
              );
            }
          )}
        </nav>

        {/* Right Side */}
        <div
  className="
  ml-auto

  hidden
  lg:flex

  items-center

  gap-3
  "
>
          {!token ? (
            <>
              <Link
                to="/login"
                className="
                px-5
                py-2.5

                rounded-xl

                bg-cyan-500

                text-black
                font-semibold

                hover:bg-cyan-400

                transition
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                 px-5
                py-2.5
                border border-cyan-200
                rounded-xl
                text-cyan-300
                font-semibold
                hover:bg-cyan-400
                

                transition
                "
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div
                className="
                hidden
                md:flex

                items-center

                gap-3
                "
              >
                <div
                  className="
                  h-9
                  w-9

                  rounded-full

                  bg-cyan-500/10

                  flex
                  items-center
                  justify-center

                  text-cyan-300
                  "
                >
                  <UserCircle2
                    size={18}
                  />
                </div>

                <div>
                  <div
                    className="
                    text-sm
                    font-medium

                    text-white
                    "
                  >
                    {user?.name ||
                      "Analyst"}
                  </div>

                  <div
                    className="
                    text-xs

                    text-slate-500
                    "
                  >
                    {user?.email}
                  </div>
                </div>
              </div>

              <button
                onClick={
                  logout
                }
                className="
                flex
                items-center

                gap-2

                text-red-300

                hover:text-red-200

                transition

                text-sm
                "
              >
                <LogOut
                  size={16}
                />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}