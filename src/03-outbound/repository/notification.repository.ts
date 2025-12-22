import { Prisma, PrismaClient } from "@prisma/client";
import {
  NewNotification,
  PersistedNotification,
} from "../../02-domain/entity/notification";
import { NotificationMapper } from "../mapper/notification.mapper";
import { INotificationRepository } from "../../02-domain/port/repositories/I.notification.repository";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";

export type PersistNotification = Prisma.NotificationGetPayload<{}>;

export const createNotificationRepository = (
  prisma: PrismaClient,
): INotificationRepository => {
  const create = async (
    entity: NewNotification,
  ): Promise<PersistedNotification> => {
    const notification = await prisma.notification.create({
      data: {
        type: entity.type,
        message: entity.message,
        read: entity.read,
        senderId: entity.senderId,
        receiverId: entity.receiverId ?? null,
      },
    });

    return NotificationMapper.toPersist(notification);
  };

  const findAll = async (userId: string): Promise<PersistedNotification[]> => {
    const records = await prisma.notification.findMany({
      where: {
        receiverId: userId
      },
    });

    return records.map((record) => NotificationMapper.toPersist(record));
  };

  const findById = async (id: string): Promise<PersistedNotification> => {
    const record = await prisma.notification.findUnique({
      where: { id },
    });

    if (!record) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }

    return NotificationMapper.toPersist(record);
  };

  const update = async (id: string): Promise<PersistedNotification> => {
    const record = await prisma.notification.update({
      where: { id },
      data: {
        read: true,
      },
    });

    return NotificationMapper.toPersist(record);
  };

  const remove = async (id: string): Promise<void> => {
    await prisma.notification.delete({
      where: { id },
    });
    return;
  };

  const removeAll = async (userId: string): Promise<void> => {
    await prisma.notification.deleteMany({
      where: {
        receiverId: userId,
      },
    });
    return;
  };

  return {
    create,
    findAll,
    findById,
    update,
    remove,
    removeAll,
  };
};
