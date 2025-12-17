import { Namespace, Server as SocketIOServer } from "socket.io";

export class NotificationGateway {
  private nsp?: Namespace;

  register(io: SocketIOServer) {
    this.nsp = io.of("/notifications");

    this.nsp.on("connection", (socket) => {
      const userId = socket.data.user?.id;
      if (!userId) {
        socket.disconnect();
        return;
      }

      const room = `user:${userId}`;
      socket.join(room);

      socket.on("disconnect", () => {
      });
    });
  }

  static emitToUser(
    io: SocketIOServer,
    userId: number,
    payload: unknown,
  ): void {
    io.of("/notifications").to(`user:${userId}`).emit("notification", payload);
  }
}
