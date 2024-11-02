import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("signal", (data: RTCSessionDescriptionInit) => {
      socket.broadcast.emit("signal", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  server.all("*", (req: Request, res: Response) => handle(req, res));

  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});