import { NotificationType } from "@prisma/client";
import { IRepository } from "../../outbound/repository";
import { INotificationService } from "../port/service/notification-service";
import { NotificationListQuery } from "../port/repository/notification-repository";
import NotFoundError from "../../shared/errors/NotFoundError";

export class NotificationService implements INotificationService {
  constructor(private readonly repository: IRepository) {}

  async list(query: NotificationListQuery) {
    return this.repository.notification.list(query);
  }

  async unreadCount(userId: number) {
    return this.repository.notification.countUnread(userId);
  }

  async markRead(userId: number, notificationId: number) {
    const updated = await this.repository.notification.markRead(
      userId,
      notificationId,
    );

    if (updated === 0) {
      throw new NotFoundError("알림을 찾을 수 없습니다.", notificationId);
    }

    return updated;
  }

  async markAllRead(userId: number) {
    return this.repository.notification.markAllRead(userId);
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
    return this.repository.notification.createMany(params);
  }
}
