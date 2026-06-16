let io;

const initializeSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "Client connected:",
      socket.id
    );

    socket.on("disconnect", () => {
      console.log(
        "Client disconnected"
      );
    });
  });
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};