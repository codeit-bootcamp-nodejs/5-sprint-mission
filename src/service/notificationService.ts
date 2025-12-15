import type { PrismaClient } from "@prisma/client";
import { NotificationType } from "@prisma/client";
import type { Server as SocketIOServer } from "socket.io";

export class NotificationService {
  private prisma: PrismaClient;
  private io?: SocketIOServer;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  setIO(io: SocketIOServer) {
    this.io = io;
  }

  // 알림 생성 및 실시간 전송
  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        message,
        isRead: false,
      },
    });

    // 실시간 알림 전송
    this.io?.to(userId).emit("notification", notification);

    return notification;
  }

  // 알림 목록 조회
  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // 안 읽은 알림 개수 조회
  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }
}
