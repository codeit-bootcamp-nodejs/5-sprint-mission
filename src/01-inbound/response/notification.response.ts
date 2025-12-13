import { NotificationType } from "@prisma/client";
import { PersistedNotificationEntity } from "../../02-domain/entity/notification";

export class NotificationResDto {
    private id: string;
    private type: NotificationType;
    private message: string;
    private read: boolean;
    private senderId: string
    private receiverId: string


    constructor(entity: PersistedNotificationEntity) {
        this.id = entity.id;
        this.type = entity.type
        this.message = entity.message;
        this.read = entity.read;
        this.senderId = entity.senderId;
        this.receiverId = entity.receiverId;
    }
}