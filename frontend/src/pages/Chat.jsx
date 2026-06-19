import { useState } from "react";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 72px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Mobile Hamburger */}

      {!sidebarOpen && (
        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
          md:hidden

          fixed
          top-20
          left-4

          z-20

          bg-cyan-500
          text-black

          px-3
          py-2

          rounded-lg
          font-bold
          "
        >
          ☰
        </button>
      )}

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="
          md:hidden

          fixed
          inset-0

          bg-black/60

          z-40
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}

      <div
  className={`
  fixed
  md:relative

  top-0
  left-0

  w-[60vw]
  max-w-[280px]
  md:w-auto

  h-screen

  z-50

  transition-transform
  duration-300

  ${
    sidebarOpen
      ? "translate-x-0"
      : "-translate-x-full md:translate-x-0"
  }
  `}
>
        <div className="relative h-full">
          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
            md:hidden

            absolute
            top-4
            right-4

            text-white
            text-xl

            z-50
            "
          >
            ✕
          </button>

          <ChatSidebar />
        </div>
      </div>

      {/* Chat Area */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: "100%",
        }}
      >
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  );
}