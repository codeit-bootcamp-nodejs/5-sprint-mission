import { Server as socketIOServer, Socket } from "socket.io";

export class NotificationGateway {
  private io: socketIOServer | null = null;

  register(io: socketIOServer) {
    this.io = io;
    
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId;
      
      if (!userId) {
        socket.disconnect();
        return;
      }
      const roomName = `userNumber ${userId}`;
      socket.join(roomName);
      console.log(`User ID ${userId} connected and joined room: ${roomName}`);
    });
  }

  sendNotification(userId: number, message: string) {
    if (!this.io) {
      return;
    }
    this.io.to(`userNumber ${userId}`).emit("Notification", message);
  }
}

export const notificationGateway = new NotificationGateway();
