import { Server as socketIOServer, Socket } from "socket.io";

export class NotificationGateway {
  private io: socketIOServer | null = null;

  register(io: socketIOServer) {
    this.io = io;
    
    this.io.on("connection", (socket: Socket) => {

      socket.on("join", (data: { userId: number }) => {
        const roomName = `userNumber ${data.userId}`;
        socket.join(roomName);
      });
    });
  }

  sendNotification(userId: number, message: string) {
    if (!this.io) {
      return
    }
    this.io.to(`userNumber ${userId}`).emit("Notification", message);
  }
}

export const notificationGateway = new NotificationGateway();
