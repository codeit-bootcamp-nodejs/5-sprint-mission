import { NotificationType } from "@prisma/client";
import {
  NotificationResDto,
  NotificationResDtos,
} from "../../01-inbound/response/notification.response";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";
import { IBaseRepository } from "../port/I.base.repository";
import { Notification } from "../entity/notification";
import { IEventBus } from "../../01-inbound/port/I.eventbus";

export const createNotificationService = (
  repos: IBaseRepository,
  eventBus: IEventBus) => {


  // 알림 생성
  const notify = async (params: {
    type: NotificationType,
    message: string,
    read: boolean,
    senderId: string,
    receiverId: string,
  }) => {
    // 알림 DB에 저장
    const notifcationEntity = Notification.createNew({ ...params });
    const notification =
      await repos.notification.create(notifcationEntity);

    // 알림 이벤트 생성
    eventBus.notification.publish(notification);
  }

  const notifyAll = async (params: {
    type: NotificationType,
    message: string,
    read: boolean,
    senderId: string,
  }) => {
    // 알림 DB에 저장
    const notifcationEntity = Notification.createNew({
      ...params,
    });

    const notification =
      await repos.notification.create(notifcationEntity);

    // 알림 이벤트 생성
    eventBus.notification.publishAll(notification);
  }

  // 모든 알림 조회
  const getNotifications = async (userId: string) => {
    const notifications = await repos.notification.findAll(userId);
    return NotificationResDtos(notifications);
  };


  // 특정 알림 읽음
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


  // 알림 삭제
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


  // 모든 알림 삭제
  const deleteAllNotifications = async (userId: string) => {
    await repos.notification.removeAll(userId);
  };

  return {
    notify,
    notifyAll,
    getNotifications,
    readNotification,
    deleteNotification,
    deleteAllNotifications,
  };
};

export type NotificationServiceType = ReturnType<
  typeof createNotificationService
>;
