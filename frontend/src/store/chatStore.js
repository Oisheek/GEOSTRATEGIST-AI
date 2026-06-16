import { create } from "zustand";

const useChatStore = create((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  setChats: (chats) => set({ chats }),

  setActiveChat: (chatId) => set({ activeChatId: chatId, messages: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  addChat: (chat) =>
    set((state) => ({ chats: [chat, ...state.chats] })),

  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((c) => c._id !== chatId),
      activeChatId: state.activeChatId === chatId ? null : state.activeChatId,
      messages: state.activeChatId === chatId ? [] : state.messages,
    })),

  updateChatTitle: (chatId, title) =>
    set((state) => ({
      chats: state.chats.map((c) => (c._id === chatId ? { ...c, title } : c)),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setSending: (isSending) => set({ isSending }),
  setError: (error) => set({ error }),
}));

export default useChatStore;