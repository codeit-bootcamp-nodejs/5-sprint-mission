import { NotificationType } from "@prisma/client";
import { INotificationRepository } from "../../02-domain/port/repositories/I.notification.repository";
import { BaseRepository } from "./base.repository";

export class NotificationRepository extends BaseRepository implements INotificationRepository {
    // Implementation for notification repository
    createArticleCommentNotification(userId: string): Promise<void> {
        return this.prisma.notification.create({
            data: {
                userId,
                type: NotificationType.ARTICLE_COMMENT,
                message: "You have a new article comment notification.",
            },
        });
    }
    createProductCommentNotification(userId: string): Promise<void> {
        return this.prisma.notification.create({
            data: {
                userId,
                type: NotificationType.PRODUCT_COMMENT,
                message: "You have a new product comment notification.",
            },
        });
    }
}