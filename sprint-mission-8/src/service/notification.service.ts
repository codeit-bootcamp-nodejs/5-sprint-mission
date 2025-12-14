import { NotificationRepository } from "../repo/notification.repository";
import { NotificationGateway } from "../gateway/notification.gateway";
import { HttpError } from "../middlewares/error.handler";
import { NotificationType } from "@prisma/client";
import { NotificationResponseDto } from "../dto/notification.dto";

export class NotificationService {
  private _notificationRepository;
  private _notificationGateway;

  constructor(
    notificationRepository: NotificationRepository,
    notificationGateway: NotificationGateway,
  ) {
    this._notificationRepository = notificationRepository;
    this._notificationGateway = notificationGateway;
  }

  async createNotification(
    userId: number,
    message: string,
    notitype: NotificationType,
    productId?: number,
    articleId?: number,
  ) {
    const newNotification = await this._notificationRepository.createNotification(
      userId,
      message,
      notitype,
      productId,
      articleId,
    );

    this._notificationGateway.sendNotification(userId, newNotification.message)

    return newNotification;
  }

  async getNotifications(userId: number): Promise<NotificationResponseDto[]> {
    const notifications = await this._notificationRepository.getNotifications(userId);

    return notifications.map((notification) => {
      const notifications: NotificationResponseDto = {
        id: notification.id,
        userId: notification.userId,
        message: notification.message,
        isRead: notification.isRead,
        notiType: notification.notiType,
        productId: notification.productId,
        articleId: notification.articleId,
        createdAt: notification.createdAt,
      }

      return notifications
	  });
  }

  async getUnreadCount(userId: number) {
    const count = await this._notificationRepository.countUnreadNotifications(userId);
    return { count };
  }

  async readNotification(notificationId: number, userId: number) {
    const notification = await this._notificationRepository.findNotificationById(notificationId);

    if (!notification) {
      throw new HttpError(404, "알림을 찾을 수 없습니다.");
    }

    if (notification.userId !== userId) {
      throw new HttpError(403, "알림을 수정할 권한이 없습니다.");
    }

    return this._notificationRepository.makeThisRead(notificationId);
  }
}
