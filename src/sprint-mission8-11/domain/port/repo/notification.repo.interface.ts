import { NotificationKeys, Sort } from "../../../types/query";
import {
  NewNotificationEntity,
  PersistNotificationEntity,
} from "../../entity/notification.entity";

export interface INotificationRepo {
  save(entity: NewNotificationEntity): Promise<PersistNotificationEntity>;
  findNotificationByIds(
    id: number,
    userId: string,
  ): Promise<PersistNotificationEntity | null>;
  getNotifications(
    userId: string,
    offset: number,
    limit: number,
    orderBy: { field: NotificationKeys; sort: Sort },
  ): Promise<PersistNotificationEntity[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(entity: PersistNotificationEntity): Promise<void>;
}
