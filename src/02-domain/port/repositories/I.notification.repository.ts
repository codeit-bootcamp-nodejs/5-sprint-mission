import { PersistNotificationEntity } from "../../entity/notification";

export interface INotificationRepository {
    createArticleCommentNotification(userId: string): Promise<PersistNotificationEntity>;
    createProductCommentNotification(userId: string): Promise<PersistNotificationEntity>;
}