import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { notificationGateway } from "./gateway/notification.gateway";

export class WSServer {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }

  start() {
    notificationGateway.register(this.io);
    console.log("WebSocket Server start.");
  }
}
