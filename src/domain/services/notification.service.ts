import { prismaClient } from "../../common/lib/prisma.client";
import { ID } from "../../common/types/common";

export interface NotificationWithActor {
  id: ID;
  recipientId: ID;
  actorId: ID;
  type: string;
  message: string;
  articleId?: ID | null;
  productId?: ID | null;
  commentId?: ID | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  actor: {
    id: ID;
    nickname: string;
    image?: string | null;
  };
}

export interface NotificationListResponse {
  notifications: NotificationWithActor[];
  unreadCount: number;
  totalCount: number;
}

export async function getUserNotifications(
  userId: ID,
  options: {
    page?: number;
    pageSize?: number;
    isRead?: boolean;
  } = {},
): Promise<NotificationListResponse> {
  const { page = 1, pageSize = 20, isRead } = options;

  interface NotificationWhere {
    recipientId: ID;
    isRead?: boolean;
  }

  const where: NotificationWhere = { recipientId: userId };
  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  const totalCount = await prismaClient.notification.count({ where });

  const unreadCount = await prismaClient.notification.count({
    where: { recipientId: userId, isRead: false },
  });

  const notifications = await prismaClient.notification.findMany({
    where,
    include: {
      actor: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    notifications: notifications as NotificationWithActor[],
    unreadCount,
    totalCount,
  };
}

export async function markNotificationAsRead(
  notificationId: ID,
  userId: ID,
): Promise<void> {
  const notification = await prismaClient.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("알림을 찾을 수 없습니다");
  }

  if (notification.recipientId !== userId) {
    throw new Error("권한이 없습니다");
  }

  await prismaClient.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(userId: ID): Promise<number> {
  const result = await prismaClient.notification.updateMany({
    where: { recipientId: userId, isRead: false },
    data: { isRead: true },
  });

  return result.count;
}

export async function deleteNotification(
  notificationId: ID,
  userId: ID,
): Promise<void> {
  const notification = await prismaClient.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new Error("알림을 찾을 수 없습니다");
  }

  if (notification.recipientId !== userId) {
    throw new Error("권한이 없습니다");
  }

  await prismaClient.notification.delete({
    where: { id: notificationId },
  });
}

export async function getUnreadNotificationCount(userId: ID): Promise<number> {
  return prismaClient.notification.count({
    where: { recipientId: userId, isRead: false },
  });
}
