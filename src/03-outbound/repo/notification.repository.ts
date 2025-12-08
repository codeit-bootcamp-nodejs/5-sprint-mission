import { NotificationType } from "@prisma/client";
import { INotificationRepository } from "../../02-domain/port/repositories/I.notification.repository";
import { BaseRepository } from "./base.repository";
import { PersistNotificationEntity } from "../../02-domain/entity/notification";

export class NotificationRepository extends BaseRepository implements INotificationRepository {
    // Implementation for notification repository
    async createArticleCommentNotification(userId: string): Promise<PersistNotificationEntity> {
        return await this.prisma.notification.create({
            data: {
                userId,
                type: NotificationType.ARTICLE_COMMENT,
                message: "You have a new article comment notification.",
            },
        });
    }
    async createProductCommentNotification(userId: string): Promise<PersistNotificationEntity> {
        return await this.prisma.notification.create({
            data: {
                userId,
                type: NotificationType.PRODUCT_COMMENT,
                message: "You have a new product comment notification.",
            },
        });
    }
}