import {
  NotificationResDto,
  NotificationResDtos,
} from "../../01-inbound/response/notification.response";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";
import { INotificationEventBus } from "../../shared/eventbus/ports/I.notification.eventbus";
import { INotificationRepository } from "../port/repositories/I.notification.repository";

export const createNotificationService = (
  notificationRepository: INotificationRepository,
  notifcationEventBus: INotificationEventBus
) => {

  // 모든 알림 조회
  const getNotifications = async (userId: string) => {
    const notifications = await notificationRepository.findAll(userId);
    return NotificationResDtos(notifications);
  };


  // 특정 알림 읽음
  const readNotification = async (userId: string, id: string) => {
    // 알림 조회 및 권한 확인
    const notification = await notificationRepository.findById(id);
    if (notification.receiverId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 알림 읽음 처리
    const notificationRead = await notificationRepository.update(id);
    return NotificationResDto(notificationRead);
  };


  // 알림 삭제
  const deleteNotification = async (userId: string, id: string) => {
    // 알림 조회 및 권한 확인
    const notification = await notificationRepository.findById(id);
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
    await notificationRepository.remove(id);
  };


  // 모든 알림 삭제
  const deleteAllNotifications = async (userId: string) => {
    await notificationRepository.removeAll(userId);
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
