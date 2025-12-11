import { NotificationEntity } from "../../02-domain/entity/notification";
import { PersistNotification } from "../repo/notification.repository";

export class NotificationMapper {
    static createPersist(record: PersistNotification) {
        return NotificationEntity.createPersist({
            id: record.id,
            type: record.type,
            message: record.message,
            read: record.read,
            senderId: record.senderId,
            receiverId: record.receiverId,
            createdAt: record.createdAt
        })
    }
}