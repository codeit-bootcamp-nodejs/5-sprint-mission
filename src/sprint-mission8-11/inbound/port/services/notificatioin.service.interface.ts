import { PersistNotificationEntity } from "../../../domain/entity/notification.entity";
import {
  GetMyNotificationsDto,
  GetUnreadCountDto,
  MarkAsReadDto,
} from "../../requests/notification/notification.schemas";

export interface INotificationService {
  getMyNotifications(
    dto: GetMyNotificationsDto,
  ): Promise<PersistNotificationEntity[]>;
  getUnreadCount(dto: GetUnreadCountDto): Promise<number>;
  markAsRead(dto: MarkAsReadDto): Promise<void>;
}
