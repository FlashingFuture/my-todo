"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const next_1 = __importDefault(require("next"));
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = (0, express_1.default)();
    const httpServer = http_1.default.createServer(server);
    const io = new socket_io_1.Server(httpServer);
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
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
