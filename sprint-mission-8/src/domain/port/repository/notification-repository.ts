import { NotificationType } from "@prisma/client";
import { PersistedNotificationEntity } from "../../entity/notification-entity";

export type NotificationListQuery = {
  userId: number;
  take: number;
  cursor?: number;
  unreadOnly?: boolean;
};

export interface INotificationRepository {
  list: (
    query: NotificationListQuery,
  ) => Promise<PersistedNotificationEntity[]>;
  countUnread: (userId: number) => Promise<number>;
  markRead: (userId: number, notificationId: number) => Promise<number>;
  markAllRead: (userId: number) => Promise<number>;
  createMany: (params: {
    userId: number;
    type: NotificationType;
    title: string;
    body?: string | null;
    url?: string | null;
    data?: unknown;
  }[]) => Promise<number>;
}
