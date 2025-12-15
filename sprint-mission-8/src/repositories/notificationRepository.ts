import NotFoundError from '../lib/errors/NotFoundError';
import { prismaClient } from '../lib/prismaClient';
import { Notification } from '../types/Notification';
import { CursorPaginationParams } from '../types/pagination';
import { getUser } from './usersRepository';

export const getNotiByUserId = async (userId: number, params: CursorPaginationParams) => {
  const { cursor, limit } = params;
  const notiWithCursor = await prismaClient.notification.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: {
      userId,
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
  });

  const totalCount = await prismaClient.notification.count({ where: { userId } });
  const unreadCount = await prismaClient.notification.count({
    where: {
      userId,
      read: false,
    },
  });
  const notifications = notiWithCursor.slice(0, limit);
  const cursorNoti = notiWithCursor[notiWithCursor.length - 1];
  const nextCursor = cursorNoti ? cursorNoti.id : null;
  return { notifications, totalCount, unreadCount, nextCursor };
};

export const createNotificationRepo = async (
  data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const existingUser = await getUser(data.userId);
  if (!existingUser) {
    throw new NotFoundError('User', data.userId);
  }
  const notification = await prismaClient.notification.create({
    data,
  });
  return notification;
};

export const createNotificationsRepo = async (
  data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>[],
) => {
  await prismaClient.notification.createMany({
    data,
  });
};

export const getNotificationById = async (id: number) => {
  const notification = await prismaClient.notification.findUnique({
    where: {
      id,
    },
  });
  return notification;
};

export const updateNotificaion = async (id: number, data: Partial<Notification>) => {
  await prismaClient.notification.update({
    where: {
      id,
    },
    data,
  });
};
