import {
  NewNotificationEntity,
  PersistNotificationEntity,
} from "../../domain/entity/notification.entity";
import { INotificationRepo } from "../../domain/port/repo/notification.repo.interface";
import { NotificationKeys, Sort } from "../../types/query";
import { NotificationMapper } from "../mapper/notification.mapper";
import { BaseRepo } from "./base.repo";

export class NotificationRepo extends BaseRepo implements INotificationRepo {
  async save(
    entity: NewNotificationEntity,
  ): Promise<PersistNotificationEntity> {
    const notification = await this._prisma.notification.create({
      data: {
        ...NotificationMapper.toCreateData(entity),
      },
    });

    return NotificationMapper.toPersistEntity(notification);
  }

  async findNotificationByIds(
    id: number,
    userId: string,
  ): Promise<PersistNotificationEntity | null> {
    const foundNotification = await this._prisma.notification.findUnique({
      where: {
        id,
        userId,
      },
    });
    return foundNotification
      ? NotificationMapper.toPersistEntity(foundNotification)
      : null;
  }

  async getNotifications(
    userId: string,
    offset: number,
    limit: number,
    orderBy: { field: NotificationKeys; sort: Sort },
  ): Promise<PersistNotificationEntity[]> {
    const foundNotifications = await this._prisma.notification.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort,
      },
    });

    return foundNotifications.map((notification) =>
      NotificationMapper.toPersistEntity(notification),
    );
  }

  async countUnread(userId: string): Promise<number> {
    return await this._prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(entity: PersistNotificationEntity): Promise<void> {
    await this._prisma.notification.update({
      where: {
        id: entity.id,
        userId: entity.userId,
      },
      data: {
        ...NotificationMapper.toUpdateData(entity),
      },
    });
  }
}
