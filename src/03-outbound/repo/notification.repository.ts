import { Prisma, PrismaClient } from "@prisma/client";
import { NewNotificationEntity, PersistNotificationEntity } from "../../02-domain/entity/notification";
import { NotificationMapper } from "../mapper/notification.mapper";



export type PersistNotification = Prisma.NotificationGetPayload<{}>;


export const createNotificationRepository = (prisma: PrismaClient) => {


    // Implementation for notification repository
    const create = async (entity: NewNotificationEntity): Promise<PersistNotificationEntity> => {
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

    return {
        create
    }
}