import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";

export default function Chat() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 72px)",
        overflow: "hidden",
      }}
    >
      <ChatSidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  );
}