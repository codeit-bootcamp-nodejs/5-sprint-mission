import {
  Prisma,
  PrismaClient,
  NotificationType,
  PrismaPromise,
} from "@prisma/client";
import { NotificationEntity } from "../../domain/entity/notification-entity";
import {
  INotificationRepository,
  NotificationListQuery,
} from "../../domain/port/repository/notification-repository";

export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async list(query: NotificationListQuery) {
    const { userId, take, cursor, unreadOnly } = query;

    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
        isRead: unreadOnly ? false : undefined,
      },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor
        ? {
            skip: 1,
            cursor: { id: cursor },
          }
        : {}),
    });

    return notifications.map(NotificationEntity.fromPersisted);
  }

  async countUnread(userId: number) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markRead(userId: number, notificationId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });

    return result.count;
  }

  async markAllRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return result.count;
  }

  async createMany(
    params: {
      userId: number;
      type: NotificationType;
      title: string;
      body?: string | null;
      url?: string | null;
      data?: unknown;
    }[],
  ) {
    if (!params.length) return 0;

    const result = await this.prisma.notification.createMany({
      data: params.map((item) => ({
        userId: item.userId,
        type: item.type,
        title: item.title,
        body: item.body ?? null,
        url: item.url ?? null,
        data:
          item.data !== undefined
            ? (item.data as Prisma.InputJsonValue)
            : undefined,
      })),
    });

    return result.count;
  }
}

type NotificationCreateParams = {
  userId: number;
  type: NotificationType;
  title: string;
  body?: string | null;
  url?: string | null;
  data?: unknown;
};

export function createNotificationsTx(
  tx: Prisma.TransactionClient,
  params: NotificationCreateParams[],
): Promise<NotificationEntity[]> {
  if (!params.length) return Promise.resolve([]);

  return Promise.all(
    params.map((item) =>
      tx.notification
        .create({
          data: {
            userId: item.userId,
            type: item.type,
            title: item.title,
            body: item.body ?? null,
            url: item.url ?? null,
            data:
              item.data !== undefined
                ? (item.data as Prisma.InputJsonValue)
                : undefined,
          },
        })
        .then(NotificationEntity.fromPersisted),
    ),
  );
}
