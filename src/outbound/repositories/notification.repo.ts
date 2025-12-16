import { PrismaClient } from "@prisma/client";
import { INotificationRepository } from "../../domain/ports/I.notification.repository";
import { ID } from "../../common/types/common";

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    recipientId: ID;
    actorId: ID;
    type: string;
    message: string;
    articleId?: ID | null;
    productId?: ID | null;
  }): Promise<{ id: ID }> {
    const notification = await this.prisma.notification.create({
      data: {
        recipientId: data.recipientId,
        actorId: data.actorId,
        type: data.type,
        message: data.message,
        articleId: data.articleId,
        productId: data.productId,
      },
    });

    return { id: notification.id };
  }

  async findByRecipientId(
    recipientId: ID,
    query: {
      limit: number;
      offset: number;
    },
  ): Promise<{ items: any[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { recipientId },
        take: query.limit,
        skip: query.offset,
        orderBy: { createdAt: "desc" },
        include: {
          actor: true,
        },
      }),
      this.prisma.notification.count({
        where: { recipientId },
      }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        recipientId: item.recipientId,
        actorId: item.actorId,
        actor: item.actor,
        type: item.type,
        message: item.message,
        isRead: item.isRead,
        articleId: item.articleId,
        productId: item.productId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      total,
    };
  }

  async countUnread(recipientId: ID): Promise<number> {
    return await this.prisma.notification.count({
      where: {
        recipientId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: ID): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(recipientId: ID): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        recipientId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async delete(notificationId: ID): Promise<void> {
    await this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async exists(notificationId: ID): Promise<boolean> {
    const count = await this.prisma.notification.count({
      where: { id: notificationId },
    });
    return count > 0;
  }
}
