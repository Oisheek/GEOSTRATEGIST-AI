import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const token =
    useAuthStore(
      (state) => state.token
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const links = [
    {
      label: "Dashboard",
      path: "/",
    },
    {
      label: "AI Assistant",
      path: "/chat",
    },
    {
      label: "Regional Intelligence",
      path: "/regions",
    },
    {
      label: "Conflict Tracker",
      path: "/conflicts",
    },
    {
      label: "News",
      path: "/news",
    },
  ];

  return (
    <>
      {/* Mobile Header */}

      <div
        className="
        flex lg:hidden
        fixed
        top-0
        left-0
        right-0

        h-16

        bg-[#161B2B]

        border-b
        border-[#3C494E]

        items-center
        justify-between

        px-4

        z-[9997]
        "
      >
       <div className="flex items-center gap-2">
  <img
    src="/logo.png"
    alt="GeoStrategist AI"
    className="h-8 w-8"
  />

  <span
    className="
    text-cyan-300
    font-semibold
    text-sm
    "
  >
    GeoStrategist AI
  </span>
</div>

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="
          text-white
          text-2xl
          "
        >
          ☰
        </button>
      </div>

      {/* Overlay */}

      {open && (
        <>
         <div
  className="
  fixed
  inset-0
  bg-black/60
  z-[9998]
  "
            onClick={() =>
              setOpen(false)
            }
          />

          {/* Sidebar */}

          <div
  className="
  fixed
  top-0
  left-0

  w-72
  h-screen

  bg-[#161B2B]

  border-r
  border-[#3C494E]

  z-[9999]

  p-6

  flex
  flex-col
  "
>
            {/* Header */}

            <div
              className="
              flex
              justify-between
              items-center
              mb-6
              "
            >
              <h2
                className="
                text-cyan-300
                font-semibold
                "
              >
                GEOSTRATEGIST AI
              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                text-slate-400
                hover:text-white
                text-xl
                "
              >
                ✕
              </button>
            </div>

            {/* User Section */}

            {token && user && (
              <div
                className="
                mb-6
                p-4

                rounded-xl

                bg-[#1E293B]

                border
                border-cyan-500/20
                "
              >
                <p
                  className="
                  text-cyan-300
                  font-semibold
                  "
                >
                  {user?.name}
                </p>

                <p
                  className="
                  text-slate-400
                  text-sm
                  break-all
                  "
                >
                  {user?.email}
                </p>
              </div>
            )}

            {/* Navigation */}
            <nav
  className="
  space-y-2
  flex-1
  overflow-y-auto
  "
>
              {links.map(
                (link) => {
                  const isActive =
                    location.pathname ===
                    link.path;

                  return (
                    <Link
                      key={
                        link.path
                      }
                      to={
                        link.path
                      }
                      onClick={() =>
                        setOpen(false)
                      }
                      className={`
                        block

                        px-4
                        py-3

                        rounded-lg

                        transition

                        ${
                          isActive
                            ? "bg-[#2F3446] text-cyan-300"
                            : "text-slate-400 hover:bg-[#2F3446] hover:text-cyan-300"
                        }
                      `}
                    >
                      {
                        link.label
                      }
                    </Link>
                  );
                }
              )}
            </nav>

            {/* Bottom Auth Section */}

            <div
  className="
  mt-auto
  pt-4
  border-t
  border-[#3C494E]
  mb-8
  "
>
              {!token ? (
                <div className="space-y-3">

                  <Link
                    to="/login"
                    onClick={() =>
                      setOpen(false)
                    }
                    className="
                    block

                    text-center

                    bg-cyan-500

                    text-black
                    font-semibold

                    py-3

                    rounded-lg

                    hover:bg-cyan-400

                    transition
                    "
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setOpen(false)
                    }
                    className="
                    block

                    text-center

                    border
                    border-cyan-300

                    text-cyan-300
                    font-semibold

                    py-3

                    rounded-lg

                    hover:bg-cyan-400
                    hover:text-black

                    transition
                    "
                  >
                    Sign Up
                  </Link>

                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="
                  w-full

                  py-3

                  rounded-lg

                  bg-red-500

                  text-white
                  font-semibold

                  hover:bg-red-600

                  transition
                  "
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}