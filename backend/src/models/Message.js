const mongoose =
  require("mongoose");

const messageSchema =
  new mongoose.Schema(
    {
      chatId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Chat",

        required: true,
      },

      role: {
        type: String,

        enum: [
          "user",
          "assistant",
          "error",
        ],

        required: true,
      },

      content: {
        type: String,

        required: true,
      },

      metadata: {
        type: Object,

        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Message",
    messageSchema
  );