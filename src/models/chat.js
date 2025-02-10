const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    createdAt: {
        type: Date,
        required: true
    }
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },
  messages: {
    type: [messageSchema]
  },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
