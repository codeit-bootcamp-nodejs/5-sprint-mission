import { Notification, NotificationType } from "@prisma/client";
import { NewNotificationEntity, NotificationEntity, PersistNotificationEntity } from "../../domain/entity/notification.entity";

export type CreateNotificationData = {
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
};

export type UpdateNotificationData = {
  isRead: boolean;
};

export class NotificationMapper {
  static toCreateData(entity: NewNotificationEntity): CreateNotificationData {
    return {
      userId: entity.userId,
      type: entity.type,
      message: entity.message,
      isRead: entity.isRead
    };
  }

  static toUpdateData(entity: PersistNotificationEntity): UpdateNotificationData {
    return {
      isRead: entity.isRead
    };
  }

  static toPersistEntity(entity: Notification): PersistNotificationEntity {
    return NotificationEntity.createPersist({
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      message: entity.message,
      isRead: entity.isRead,
      createdAt: entity.createdAt
    });
  }
}