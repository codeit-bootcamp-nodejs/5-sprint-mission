import { INotificationService } from "../../inbound/port/services/notificatioin.service.interface";
import { GetMyNotificationsDto, GetUnreadCountDto, MarkAsReadDto } from "../../inbound/requests/notification/notification.schemas";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Exception } from "../../shared/exception/exception";
import { NotificationKeys, Sort } from "../../types/query";
import { PersistNotificationEntity } from "../entity/notification.entity";
import { BaseService } from "./base.service";

export class NotificationService extends BaseService implements INotificationService {
  async getMyNotifications(dto: GetMyNotificationsDto): Promise<PersistNotificationEntity[]> {
    const orderBy :{ field: NotificationKeys, sort: Sort } = {
      field: "createdAt",
      sort: "asc"
    }

    const foundNotifications = await this._repos.notification.getNotifications(
      dto.userId,
      dto.offset,
      dto.limit,
      orderBy
    );

    return foundNotifications;
  }

  async getUnreadCount(dto: GetUnreadCountDto): Promise<number> {
    return await this._repos.notification.countUnread(dto.userId);
  }

  async markAsRead(dto: MarkAsReadDto): Promise<void> {
    const foundNotification = await this._repos.notification.findNotificationByIds(dto.notificationId, dto.userId);

    if(!foundNotification){
      throw new Exception({
        info: EXCEPTIONS.NOTIFICATION_NOT_EXIST
      })
    }

    foundNotification.markAsRead();

    await this._repos.notification.markAsRead(foundNotification);
    
  }
  
}