import express from "express";
import http from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("signal", (data) => {
      socket.broadcast.emit("signal", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  server.all("*", (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});