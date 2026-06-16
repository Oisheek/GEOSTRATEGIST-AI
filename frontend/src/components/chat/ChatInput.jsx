import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import useChatStore from "../../store/chatStore";
import { sendMessage, createChat } from "../../services/chatService";

const SUGGESTED_PROMPTS = [
  "What is the current risk level in the Middle East?",
  "Analyze India-Pakistan military tensions",
  "What are the economic impacts of the Ukraine war?",
  "Forecast the South China Sea situation in 2025",
];

export default function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const { activeChatId, isSending, addMessage, addChat, setActiveChat, setSending, setError } = useChatStore();

  // FIX: Improved Auto-resize logic
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    
    // 1. Reset to exactly 1 line of height first (matches lineHeight)
    el.style.height = "24px"; 
    
    // 2. Then expand to fit text, up to a maximum of 160px
    const newHeight = Math.min(el.scrollHeight, 160);
    el.style.height = newHeight + "px";
  }, [input]);

  const handleSend = async (forcedContent = "") => {
    const content = forcedContent ? forcedContent.trim() : input.trim();
    if (!content || isSending) return;

    if (!forcedContent) setInput("");
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
      console.error("Send failed:", err);
      addMessage({
        _id: Date.now() + 1,
        role: "error",
        content: "Failed to get a response. Please try again.",
        createdAt: new Date(),
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    handleSend(prompt);
  };

  return (
    <div style={{ padding: "12px 24px 20px", borderTop: "1px solid var(--border, #1e2a45)" }}>
      {!activeChatId && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestedPrompt(prompt)}
              style={{
                padding: "6px 12px", borderRadius: "16px", fontSize: "12px",
                color: "#94a3b8", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#38bdf8"; e.target.style.color = "#38bdf8"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "#94a3b8"; }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div style={{
        display: "flex", gap: "10px", alignItems: "flex-end",
        background: "#0b1020", 
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px", padding: "10px 12px",
        transition: "border-color 0.15s",
      }}
        onFocus={(e) => e.currentTarget.style.borderColor = "#38bdf8"}
        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about geopolitical risks, conflicts, forecasts..."
          disabled={isSending}
          rows={1}
          style={{
            flex: 1, 
            background: "transparent", 
            border: "none", 
            outline: "none",
            color: "var(--text, #e2e8f0)", 
            fontSize: "14px", 
            lineHeight: "24px", // FIX: Match lineHeight to height exactly
            resize: "none", 
            fontFamily: "inherit", 
            height: "24px",     // FIX: Force initial tight height
            margin: "6px 0",    // FIX: Centers it vertically with the 36px send button
            padding: 0,         // FIX: Removes internal padding that inflates scrollHeight
            overflowY: "hidden", 
            opacity: isSending ? 0.6 : 1,
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isSending}
          style={{
            width: "36px", height: "36px", borderRadius: "8px", border: "none",
            background: input.trim() && !isSending ? "#38bdf8" : "rgba(255,255,255,0.06)",
            color: input.trim() && !isSending ? "#0b1120" : "#475569",
            cursor: input.trim() && !isSending ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justify: "center",
            justifyContent: "center",
            flexShrink: 0, transition: "all 0.15s",
          }}
        >
          {isSending
            ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            : <Send size={16} />
          }
        </button>
      </div>
      
      <p style={{ fontSize: "11px", color: "#334155", margin: "8px 0 0", textAlign: "center" }}>
        GeoStrategist is AI and can make mistakes. Always verify critical information from trusted sources.
      </p>

      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg) } 
          to { transform: rotate(360deg) } 
        }
      `}</style>
    </div>
  );
}