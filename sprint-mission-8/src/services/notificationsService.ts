import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import {
  createNotificationRepo,
  createNotificationsRepo,
  getNotiByUserId,
  getNotificationById,
  updateNotificaion,
} from '../repositories/notificationRepository';
import { Notification } from '../types/Notification';
import { CursorPaginationParams } from '../types/pagination';
import { sendNotification } from './socketService';
import { getUser } from './usersService';

export const createNotification = async (
  data: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt'>,
) => {
  const user = await getUser(data.userId);
  if (!user) {
    throw new NotFoundError('User', data.userId);
  }

  const notification = await createNotificationRepo({
    ...data,
    read: false,
  });

  sendNotification(notification as Notification);

  return notification;
};

export const createNotifications = async (
  notifications: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt'>[],
) => {
  await createNotificationsRepo(
    notifications.map((notification) => {
      return {
        ...notification,
        read: false,
      };
    }),
  );

  notifications.forEach((notification) => {
    sendNotification(notification as Notification);
  });
};

export const readNotificationById = async (id: number, userId?: number) => {
  if (!userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const notification = await getNotificationById(id);
  if (!notification) {
    throw new NotFoundError('Notification', id);
  }

  if (notification.userId !== userId) {
    throw new ForbiddenError("Cannot read other user's notification");
  }

  await updateNotificaion(id, { read: true });
};

export const getMyNotifications = async (userId: number, params: CursorPaginationParams) => {
  const { cursor, limit } = params;
  const { notifications, totalCount, unreadCount, nextCursor } = await getNotiByUserId(userId, {
    cursor,
    limit,
  });

  return { list: notifications, totalCount, unreadCount, nextCursor };
};
