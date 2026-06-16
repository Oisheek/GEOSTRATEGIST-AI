import { useEffect, useRef } from "react";
import { Bot, User, AlertCircle } from "lucide-react";
import useChatStore from "../../store/chatStore";
import { getMessages, sendMessage, createChat } from "../../services/chatService";

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      padding: "16px 0",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-start",
    }}>
      {/* Avatar */}
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: isUser ? "rgba(56,189,248,0.15)" : isError ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)",
        border: `1px solid ${isUser ? "rgba(56,189,248,0.3)" : isError ? "rgba(239,68,68,0.3)" : "rgba(99,102,241,0.3)"}`,
        display: "flex",
        alignItems: "center",
        justify: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {isUser
          ? <User size={16} color="#38bdf8" />
          : isError
            ? <AlertCircle size={16} color="#ef4444" />
            : <Bot size={16} color="#818cf8" />
        }
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: "75%",
        padding: "12px 16px",
        borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        background: isUser
          ? "rgba(56,189,248,0.12)"
          : isError
            ? "rgba(239,68,68,0.08)"
            : "rgba(255,255,255,0.04)",
        border: `1px solid ${isUser ? "rgba(56,189,248,0.2)" : isError ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}>
        <p style={{
          margin: 0,
          fontSize: "14px",
          lineHeight: "1.65",
          color: isError ? "#fca5a5" : "var(--text, #e2e8f0)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}>
          {message.content}
        </p>
        <span style={{ fontSize: "11px", color: "#475569", marginTop: "6px", display: "block" }}>
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "12px", padding: "16px 0", alignItems: "flex-start" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%",
        background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Bot size={16} color="#818cf8" />
      </div>
      <div style={{
        padding: "14px 18px", borderRadius: "4px 16px 16px 16px",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", gap: "5px", alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: "7px", height: "7px", borderRadius: "50%", background: "#64748b",
            animation: "pulse 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
            display: "inline-block",
          }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const { activeChatId, messages, isSending, setMessages, setLoading, addMessage, addChat, setActiveChat, setSending, setError } = useChatStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!activeChatId) return;
    loadMessages();
  }, [activeChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await getMessages(activeChatId);
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Triggers automated API post execution on suggestion selection
  const handleSuggestionSubmit = async (content) => {
    if (isSending) return;
    setSending(true);
    setError(null);

    try {
      let chatId = activeChatId;
      if (!chatId) {
        const res = await createChat(content.slice(0, 50));
        const chat = res.data.data.chat;
        addChat(chat);
        setActiveChat(chat._id);
        chatId = chat._id;
      }

      addMessage({ _id: Date.now(), role: "user", content, createdAt: new Date() });
      const res = await sendMessage(chatId, content);
      addMessage(res.data.data.message);
    } catch (err) {
      console.error("Suggestion submission execution failed:", err);
      addMessage({
        _id: Date.now() + 1,
        role: "error",
        content: "Failed to process target scenario. Try again.",
        createdAt: new Date(),
      });
    } finally {
      setSending(false);
    }
  };

  if (!activeChatId) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Bot size={32} color="#818cf8" />
        </div>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--text, #e2e8f0)", margin: "0 0 8px", fontSize: "18px" }}>
            GeoStrategist AI
          </h3>
          <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
            Select a chat or start a new one to begin your geopolitical analysis.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "480px", marginTop: "8px", padding: "0 16px" }}>
          {[
            "Analyze the Russia-Ukraine conflict",
            "What are the risks in the South China Sea?",
            "Forecast Taiwan invasion probability",
            "Compare NATO vs BRICS military strength",
          ].map((prompt) => (
            <button 
              key={prompt} 
              onClick={() => handleSuggestionSubmit(prompt)}
              style={{
                padding: "8px 14px", borderRadius: "20px", fontSize: "12px",
                color: "#94a3b8", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#38bdf8"; e.target.style.color = "#38bdf8"; e.target.style.background = "rgba(56,189,248,0.05)"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.color = "#94a3b8"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}
      {isSending && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}