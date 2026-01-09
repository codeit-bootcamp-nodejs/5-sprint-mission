import { PersistNotificationEntity } from "../../../application/command/entity/notification.entity";

export class GetNotificationsResDto {
  constructor(public notifications: PersistNotificationEntity[]) {}
}
