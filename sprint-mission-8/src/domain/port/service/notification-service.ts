import { NotificationType } from "@prisma/client";
import { PersistedNotificationEntity } from "../../entity/notification-entity";
import { NotificationListQuery } from "../repository/notification-repository";

export interface INotificationService {
  list: (
    query: NotificationListQuery,
  ) => Promise<PersistedNotificationEntity[]>;
  unreadCount: (userId: number) => Promise<number>;
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
