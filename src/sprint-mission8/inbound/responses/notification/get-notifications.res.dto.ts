import { PersistNotificationEntity } from "../../../domain/entity/notification.entity";

export class GetNotificationsResDto {
  constructor(public notifications: PersistNotificationEntity[]) {
  }
}