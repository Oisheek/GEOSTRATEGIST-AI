import Topbar from "../components/layout/Topbar";
import { useLocation } from "react-router-dom";

export default function AppLayout({
  children,
}) {
  const location =
    useLocation();

  const isChatPage =
    location.pathname ===
    "/chat";

  return (
    <div
      className="
      min-h-screen
      bg-[#020617]
      text-slate-100
      relative
      overflow-hidden
      "
    >
      <div
        className="
        absolute
        inset-0
        pointer-events-none
        bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_55%)]
      "
      />

      <div
        className="
        relative
        min-h-screen
        flex
        flex-col
        "
      >
        <Topbar />

        <main
          className="
          flex-1
          w-full
          "
        >
          {isChatPage ? (
            children
          ) : (
            <div
              className="
              max-w-[1700px]
              mx-auto

              px-4
              md:px-6
              lg:px-8

              pb-10
              "
            >
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}