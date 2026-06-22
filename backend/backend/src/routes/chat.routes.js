const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getChats, createChat, getMessages, sendMessage, deleteChat } = require("../controllers/chat.controller");

router.use(auth);

router.get("/", getChats);
router.post("/", createChat);
router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);
router.delete("/:id", deleteChat);

module.exports = router;