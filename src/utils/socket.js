const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connection");

const createRoomHash = (loggedInUserId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([loggedInUserId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("join", ({ loggedInUserId, targetUserId, firstName }) => {
      const room = createRoomHash(loggedInUserId, targetUserId);
      console.log(`${firstName} joined ${room}`);
      socket.join(room);
    });

    socket.on(
      "sendMessage",
      async ({ text, loggedInUserId, targetUserId, firstName, photoUrl }) => {
        try {
          const room = createRoomHash(loggedInUserId, targetUserId);
          console.log(`${firstName} joined ${room} and sent message : ${text}`);

          //find if user are connected before sending message
          const isConnected = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: loggedInUserId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: loggedInUserId,
                status: "accepted",
              },
            ],
          });
          if (!isConnected) throw new Error("User not connected");

          //save message in DB
          let chat = await Chat.findOne({
            participants: { $all: [loggedInUserId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [loggedInUserId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: loggedInUserId,
            text,
            createdAt: new Date(),
          });
          await chat.save();

          io.to(room).emit("messageReceived", {
            firstName,
            text,
            photoUrl,
            createdAt: chat.messages.createdAt,
            senderId: loggedInUserId,
          });
        } catch (err) {
          console.error(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
