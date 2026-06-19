import { useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Bot,
} from "lucide-react";

import useChatStore from "../../store/chatStore";

import {
  getChats,
  createChat,
  deleteChat,
} from "../../services/chatService";

export default function ChatSidebar() {
  const {
    chats,
    activeChatId,
    setChats,
    setActiveChat,
    addChat,
    removeChat,
    setMessages,
  } = useChatStore();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res =
        await getChats();

      setChats(
        res.data.data.chats
      );
    } catch (err) {
      console.error(
        "Failed to load chats",
        err
      );
    }
  };

  const handleNewChat =
    async () => {
      try {
        const res =
          await createChat();

        const chat =
          res.data.data.chat;

        addChat(chat);

        setActiveChat(
          chat._id
        );

        setMessages([]);
      } catch (err) {
        console.error(
          "Failed to create chat",
          err
        );
      }
    };

  const handleDelete =
    async (
      e,
      chatId
    ) => {
      e.stopPropagation();

      try {
        await deleteChat(
          chatId
        );

        removeChat(
          chatId
        );
      } catch (err) {
        console.error(
          "Failed to delete chat",
          err
        );
      }
    };

  return (
    <div
    style={{
  minWidth:
    window.innerWidth < 768
      ? "60vw"
      : "260px",
  
  maxWidth:
    window.innerWidth < 768
      ? "320px"
      : "260px",
    
      height: "100vh",
    
      flexShrink: 0,
    
      background: "#0f1629",
    
      borderRight:
        "1px solid #1e2a45",
    
      display: "flex",
    
      flexDirection: "column",
    
      overflow: "hidden",
    }}
    >
      {/* Header */}

      <div
        style={{
          padding:
            "20px 16px 12px",

          borderBottom:
            "1px solid #1e2a45",
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "8px",

            marginBottom:
              "12px",
          }}
        >
          <Bot
            size={20}
            color="#38bdf8"
          />

          <span
            style={{
              color:
                "#e2e8f0",

              fontWeight:
                700,

              fontSize:
                "15px",
            }}
          >
            AI Assistant
          </span>
        </div>

        <button
          onClick={
            handleNewChat
          }
          style={{
            width: "100%",

            display:
              "flex",

            alignItems:
              "center",

            gap: "8px",

            padding:
              "10px 14px",

            background:
              "#38bdf8",

            color:
              "#0b1120",

            border:
              "none",

            borderRadius:
              "10px",

            cursor:
              "pointer",

            fontWeight:
              600,

            fontSize:
              "14px",
          }}
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Chat List */}

      <div
        style={{
          flex: 1,

          overflowY:
            "auto",

          padding: "8px",
        }}
      >
        {chats.length ===
          0 && (
          <p
            style={{
              color:
                "#64748b",

              fontSize:
                "13px",

              textAlign:
                "center",

              marginTop:
                "24px",
            }}
          >
            No chats yet.
            Start a new one!
          </p>
        )}

        {chats.map(
          (chat) => (
            <div
              key={
                chat._id
              }
              onClick={() =>
                setActiveChat(
                  chat._id
                )
              }
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "10px",

                padding:
                  "10px 12px",

                borderRadius:
                  "10px",

                cursor:
                  "pointer",

                marginBottom:
                  "4px",

                background:
                  activeChatId ===
                  chat._id
                    ? "rgba(56,189,248,0.12)"
                    : "transparent",

                border:
                  activeChatId ===
                  chat._id
                    ? "1px solid rgba(56,189,248,0.25)"
                    : "1px solid transparent",

                transition:
                  "all 0.15s",
              }}
            >
              <MessageSquare
                size={15}
                color={
                  activeChatId ===
                  chat._id
                    ? "#38bdf8"
                    : "#64748b"
                }
              />

              <span
                style={{
                  flex: 1,

                  fontSize:
                    "13px",

                  color:
                    activeChatId ===
                    chat._id
                      ? "#e2e8f0"
                      : "#94a3b8",

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",
                }}
              >
                {chat.title}
              </span>

              <button
                onClick={(
                  e
                ) =>
                  handleDelete(
                    e,
                    chat._id
                  )
                }
                style={{
                  background:
                    "none",

                  border:
                    "none",

                  cursor:
                    "pointer",

                  padding:
                    "2px",

                  opacity:
                    0.5,
                }}
              >
                <Trash2
                  size={13}
                  color="#94a3b8"
                />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}