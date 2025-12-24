import { NotificationResDtos, NotificationResDto } from "../../../01-inbound/response/notification.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { INotificationCommandRepository } from "../../port/repositories/command/I.notification.repository";

;

export const createNotificationCommandService = (
  notificationCommandRepository: INotificationCommandRepository,
  notifcationEventBus: INotificationEventBus
) => {

  // 특정 알림 읽음
  const readNotification = async (userId: string, id: string) => {
    // 알림 조회 및 권한 확인
    const notification = await notificationCommandRepository.findById(id);
    if (notification.receiverId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 알림 읽음 처리
    const notificationRead = await notificationCommandRepository.update(id);
    return NotificationResDto(notificationRead);
  };


  // 알림 삭제
  const deleteNotification = async (userId: string, id: string) => {
    // 알림 조회 및 권한 확인
    const notification = await notificationCommandRepository.findById(id);
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
    await notificationCommandRepository.remove(id);
  };


  // 모든 알림 삭제
  const deleteAllNotifications = async (userId: string) => {
    await notificationCommandRepository.removeAll(userId);
  };

  return {
    readNotification,
    deleteNotification,
    deleteAllNotifications,
  };
};

export type NotificationCommandServiceType = ReturnType<
  typeof createNotificationCommandService
>;
