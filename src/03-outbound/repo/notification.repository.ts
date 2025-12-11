import { NotificationType, Prisma, PrismaClient } from "@prisma/client";
import { INotificationRepository } from "../../02-domain/port/repositories/I.notification.repository";
import { BaseRepository } from "./base.repository";
import { NewNotificationEntity, NotificationEntity, PersistNotificationEntity } from "../../02-domain/entity/notification";
import { NotificationMapper } from "../mapper/notification.mapper";



export type PersistNotification = Prisma.NotificationGetPayload<{}>;


export class NotificationRepository extends BaseRepository implements INotificationRepository {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    // Implementation for notification repository
    async create(entity: NewNotificationEntity): Promise<PersistNotificationEntity> {
        const notification = await this.prisma.notification.create({
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
}