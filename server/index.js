import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {} from "dotenv/config";

import { generateRandomId, generateRandomNumber } from "./utils/utils.js";
import { initializeStore } from "./utils/sessions.js";
import { initializeChannel } from "./utils/channels.js";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 8181;

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://piehost.com",
    ],
  },
});

const CHANNEL_NAMES = ["welcome", "general", "react", "learners", "casual"];
const WELCOME_CHANNEL = "welcome";

const sessions = initializeStore();
const channels = CHANNEL_NAMES.map((channel) => initializeChannel(channel));

io.use(async (socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;

  // Ability to restore session from the client, if session ID is known.
  if (sessionId) {
    const session = sessions.getSessionById(sessionId);

    if (session) {
      socket.sessionId = sessionId;
      socket.userId = session.userId;
      socket.username = session.username;
      socket.avatar = session.avatar;

      next();
    }
  }

  const username =
    socket.handshake.auth.username || `anonymous_${generateRandomId(2)}`;

  socket.sessionId = generateRandomId();
  socket.userId = generateRandomId();
  socket.username = username;
  socket.avatar = generateRandomNumber();

  next();
});

io.on("connection", (socket) => {
  console.log("connected", socket.username);
  const currentSession = {
    sessionId: socket.sessionId,
    userId: socket.userId,
    username: socket.username,
    connected: true,
    avatar: socket.avatar,
  };

  sessions.setSession(socket.sessionId, currentSession);
  socket.emit("session", currentSession);

  channels.forEach((channel) => socket.join(channel.name));
  socket.join(currentSession.userId);

  socket.broadcast.emit("user:join", {
    userId: currentSession.userId,
    username: currentSession.username,
    connected: true,
    avatar: currentSession.avatar,
  });

  socket.emit("channels", channels);
  socket.emit("users", sessions.getAllUsers());

  socket.on("user:leave", () => {
    socket.in(WELCOME_CHANNEL).emit("user:leave", {
      userId: currentSession.userId,
      username: currentSession.username,
      connected: false,
    });

    sessions.deleteSession(socket.sessionId);
    socket.disconnect();
  });

  socket.on("message:channel:send", (channel, messageData) => {
    io.to(channel).emit("message:channel", messageData);
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.connected);
    const session = sessions.getSessionById(socket.sessionId);

    if (!session) return;

    sessions.setSession(socket.sessionId, {
      ...session,
      connected: false,
    });

    socket.broadcast.emit("user:disconnect", {
      userId: session.userId,
      username: session.username,
      connected: false,
    });
  });
});

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});
