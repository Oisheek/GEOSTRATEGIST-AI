import api from "./api";

export const getChats = () => api.get("/chat");

export const createChat = (title = "New Chat") => api.post("/chat", { title });

export const getMessages = (chatId) => api.get(`/chat/${chatId}/messages`);

export const sendMessage = (chatId, content) =>
  api.post(`/chat/${chatId}/messages`, { content });

export const deleteChat = (chatId) => api.delete(`/chat/${chatId}`);