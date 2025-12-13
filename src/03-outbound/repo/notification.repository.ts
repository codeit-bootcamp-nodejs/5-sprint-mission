import { Prisma, PrismaClient } from "@prisma/client";
import { NewNotificationEntity, PersistedNotificationEntity } from "../../02-domain/entity/notification";
import { NotificationMapper } from "../mapper/notification.mapper";



export type PersistNotification = Prisma.NotificationGetPayload<{}>;


export const createNotificationRepository = (prisma: PrismaClient) => {


    // Implementation for notification repository
    const create = async (entity: NewNotificationEntity): Promise<PersistedNotificationEntity> => {
        const notification = await prisma.notification.create({
            data: {
                type: entity.type,
                message: entity.message,
                read: entity.read,
                senderId: entity.senderId,
                receiverId: entity.receiverId,
            }
        })

        return NotificationMapper.createPersist(notification);
    }

    const findAll = async (userId: string): Promise<PersistedNotificationEntity[]> => {
        const records = await prisma.notification.findMany({
            where: {
                receiverId: userId
            }
        })

        return records.map((record) => NotificationMapper.createPersist(record))
    }


    const findById = async (id: string): Promise<PersistedNotificationEntity> => {
        const record = await prisma.notification.findUnique({
            where: { id }
        })

        if (!record) {
            throw new Error("알림을 찾을 수 없습니다.");
        }

        return NotificationMapper.createPersist(record);

    }


    const remove = async (id: string): Promise<void> => {
        await prisma.notification.delete({
            where: { id }
        })
        return
    }

    const removeAll = async (userId: string): Promise<void> => {
        await prisma.notification.deleteMany({
            where: {
                receiverId: userId
            }
        });
        return;
    }


    return {
        create,
        findAll,
        findById,
        remove, 
        removeAll
    }
}