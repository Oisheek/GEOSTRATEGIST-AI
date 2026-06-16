const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { sendMessage: agentSendMessage } = require("../ai/agents/chat.agent");
const { success } = require("../utils/response");
const AppError = require("../errors/AppError");

// GET /api/chat — list all chats for user
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user.id, isArchived: false })
      .sort({ updatedAt: -1 })
      .limit(50);
    return success(res, { chats });
  } catch (err) { next(err); }
};

// POST /api/chat — create new chat
const createChat = async (
  req,
  res,
  next
) => {

  try {

    console.log("CREATE CHAT");
    console.log(req.user);

    const chat =
      await Chat.create({
        userId:
          req.user.id,

        title:
          req.body.title ||
          "New Chat",
      });

    console.log(chat);

    return success(
      res,
      { chat },
      "Chat created"
    );

  } catch (err) {

    console.error(
      "CREATE CHAT ERROR"
    );

    console.error(err);

    next(err);

  }

};

// GET /api/chat/:id/messages — get messages for a chat
const getMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) throw new AppError("Chat not found", 404);

    const messages = await Message.find({ chatId: req.params.id }).sort({ createdAt: 1 });
    return success(res, { chat, messages });
  } catch (err) { next(err); }
};

// POST /api/chat/:id/messages — send a message
const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) throw new AppError("Message content is required", 400);

    const assistantMessage = await agentSendMessage(req.params.id, req.user.id, content.trim());
    return success(res, { message: assistantMessage }, "Message sent");
  } catch (err) { next(err); }
};

// DELETE /api/chat/:id — archive/delete a chat
const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isArchived: true },
      { new: true }
    );
    if (!chat) throw new AppError("Chat not found", 404);
    return success(res, null, "Chat deleted");
  } catch (err) { next(err); }
};

module.exports = { getChats, createChat, getMessages, sendMessage, deleteChat };