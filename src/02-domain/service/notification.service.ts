import {
  NotificationResDto,
  NotificationResDtos,
} from "../../01-inbound/response/notification.response";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";
import { IBaseRepository } from "../port/I.base.repository";

export const createNotificationService = (repos: IBaseRepository) => {
  const getNotifications = async (userId: string) => {
    const notifications = await repos.notification.findAll(userId);
    return NotificationResDtos(notifications);
  };

  const readNotification = async (userId: string, id: string) => {
    // 알림 조회 및 권한 확인
    const notification = await repos.notification.findById(id);
    if (notification.receiverId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 알림 읽음 처리
    const notificationRead = await repos.notification.update(id);
    return NotificationResDto(notificationRead);
  };

  const deleteNotification = async (userId: string, id: string) => {
    // 알림 조회 및 권한 확인
    const notification = await repos.notification.findById(id);
    if (!notification) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND
      })
    }
    if (notification.receiverId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 알림 삭제
    await repos.notification.remove(id);
  };

  const deleteAllNotifications = async (userId: string) => {
    await repos.notification.removeAll(userId);
  };

  return {
    getNotifications,
    readNotification,
    deleteNotification,
    deleteAllNotifications,
  };
};

export type NotificationServiceType = ReturnType<
  typeof createNotificationService
>;
