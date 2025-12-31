import { INotificationService } from "../../inbound/port/services/notificatioin.service.interface";
import {
  GetMyNotificationsDto,
  GetUnreadCountDto,
  MarkAsReadDto,
} from "../../inbound/requests/notification/notification.schemas";
import { BusinessExceptionType } from "../../shared/const/business.exception.info";
import { BusinessException } from "../../shared/exceptions/business.exception";
import { NotificationKeys, Sort } from "../../types/query";
import { PersistNotificationEntity } from "../entity/notification.entity";
import { INotificationRepo } from "../port/repo/notification.repo.interface";

export class NotificationService implements INotificationService {
  constructor(private readonly _notificationRepo: INotificationRepo) {}
  async getMyNotifications(
    dto: GetMyNotificationsDto,
  ): Promise<PersistNotificationEntity[]> {
    const orderBy: { field: NotificationKeys; sort: Sort } = {
      field: "createdAt",
      sort: "asc",
    };

    const foundNotifications = await this._notificationRepo.getNotifications(
      dto.userId,
      dto.offset,
      dto.limit,
      orderBy,
    );

    return foundNotifications;
  }

  async getUnreadCount(dto: GetUnreadCountDto): Promise<number> {
    return await this._notificationRepo.countUnread(dto.userId);
  }

  async markAsRead(dto: MarkAsReadDto): Promise<void> {
    const foundNotification =
      await this._notificationRepo.findNotificationByIds(
        dto.notificationId,
        dto.userId,
      );

    if (!foundNotification) {
      throw new BusinessException({
        type: BusinessExceptionType.NOTIFICATION_NOT_EXIST,
      });
    }

    foundNotification.markAsRead();

    await this._notificationRepo.markAsRead(foundNotification);
  }
}
