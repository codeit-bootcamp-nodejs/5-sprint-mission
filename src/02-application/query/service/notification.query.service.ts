import {
  NotificationResDtos,
  NotificationResDto,
} from "../../../01-inbound/response/notification.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../../shared/exception/exception";
import { IRedisExternal } from "../../port/externals/I.redis.external";
import { INotificationCommandRepository } from "../../port/repositories/command/I.notification.repository";
import { INotificationQueryRepository } from "../../port/repositories/query/I.notification.query.repository";

export const createNotificationQueryService = (
  redisExternal: IRedisExternal,
  notificationQueryRepository: INotificationQueryRepository,
  notifcationEventBus: INotificationEventBus,
) => {
  // 모든 알림 조회
  const getNotifications = async (userId: string) => {
    const notifications = await notificationQueryRepository.findAll(userId);
    return notifications;
  };

  return {
    getNotifications,
  };
};

export type NotificationQueryServiceType = ReturnType<
  typeof createNotificationQueryService
>;
