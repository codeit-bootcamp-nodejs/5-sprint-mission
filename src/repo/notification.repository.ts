import prisma from "../prisma.client";
import { NotificationType } from "@prisma/client";

export class NotificationRepository {
  async createNotification(
    userId: number,
    message: string,
    notiType: NotificationType,
    productId?: number,
    articleId?: number,
  ) {
    return prisma.notification.create({
      data: {
        userId,
        message,
        notiType,
        productId,
        articleId,
      },
    });
  }

  async getNotifications(userId: number) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async countUnreadNotifications(userId: number) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async findNotificationById(id: number) {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async makeThisRead(id: number) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
