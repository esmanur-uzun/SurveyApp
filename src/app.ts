import express from "express";
import { Server } from "socket.io";
import http from "http";
import { config } from "./@utils/config";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("bir kullanıcı bağlandı", socket.id);
});
