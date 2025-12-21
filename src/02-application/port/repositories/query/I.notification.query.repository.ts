import { NotificationView } from "../../../query/view/notification.view";

export interface INotificationQueryRepository {
    findAll(userId: string): Promise<NotificationView[]>;
}