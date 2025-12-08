export interface INotificationRepository {
    createArticleCommentNotification(userId: string): Promise<void>;
    createProductCommentNotification(userId: string): Promise<void>;
}