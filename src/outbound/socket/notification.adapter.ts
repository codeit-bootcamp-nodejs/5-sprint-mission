import { Server as SocketIOServer } from "socket.io";
import { ID } from "../../common/types/common";

export class NotificationAdapter {
  constructor(private io: SocketIOServer) {}

  async sendNotificationToUser(
    recipientId: ID,
    notification: {
      type: string;
      message: string;
      actorId?: ID;
      articleId?: ID | null;
      productId?: ID | null;
      [key: string]: unknown;
    },
  ): Promise<void> {
    try {
      this.io.to(`user:${recipientId}`).emit("notification:new", {
        success: true,
        data: notification,
      });
    } catch (error) {
      console.error(
        `Failed to send notification to user ${recipientId}:`,
        error,
      );
    }
  }

  async disconnectUser(userId: ID): Promise<void> {
    try {
      const room = this.io.sockets.adapter.rooms.get(`user:${userId}`);
      if (room) {
        for (const socketId of room) {
          const socket = this.io.sockets.sockets.get(socketId);
          if (socket) {
            socket.disconnect(true);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to disconnect user ${userId}:`, error);
    }
  }

  getConnectedSocketsForUser(userId: ID): number {
    try {
      const room = this.io.sockets.adapter.rooms.get(`user:${userId}`);
      return room ? room.size : 0;
    } catch (error) {
      console.error(
        `Failed to get connected sockets for user ${userId}:`,
        error,
      );
      return 0;
    }
  }

  getConnectedUsersCount(): number {
    try {
      const sockets = this.io.sockets.sockets.size;
      return sockets;
    } catch (error) {
      console.error("Failed to get connected users count:", error);
      return 0;
    }
  }

  broadcastNotificationMarked(
    recipientId: ID,
    notificationId: ID,
    isRead: boolean,
  ): void {
    try {
      this.io.to(`user:${recipientId}`).emit("notification:marked", {
        success: true,
        data: {
          notificationId,
          isRead,
        },
      });
    } catch (error) {
      console.error("Failed to broadcast notification marked event:", error);
    }
  }

  broadcastUnreadCountUpdate(recipientId: ID, unreadCount: number): void {
    try {
      this.io.to(`user:${recipientId}`).emit("notification:unread-count", {
        success: true,
        data: {
          unreadCount,
        },
      });
    } catch (error) {
      console.error("Failed to broadcast unread count update:", error);
    }
  }
}
