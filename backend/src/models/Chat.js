const mongoose =
  require("mongoose");

const chatSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      title: {
        type: String,

        default:
          "New Chat",
      },

      lastMessage: {
        type: String,

        default: "",
      },

      messageCount: {
        type: Number,

        default: 0,
      },

      isArchived: {
        type: Boolean,

        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Chat",
    chatSchema
  );