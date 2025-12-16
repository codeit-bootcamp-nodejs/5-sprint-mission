import { Request, Response } from "express";
import { create } from "superstruct";
import { prismaClient } from "../../common/lib/prisma.client";
import { IdParamsStruct } from "../../common/validation/common.structs";
import { AuthenticatedHandler } from "../../common/types/common";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";

export const getNotifications: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const [notifications, unreadCount] = await Promise.all([
    prismaClient.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
    }),
    prismaClient.notification.count({
      where: { recipientId: userId, isRead: false },
    }),
  ]);

  res.send({
    items: notifications,
    unreadCount,
    total: notifications.length,
  });
};

export const markAsRead: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const notification = await prismaClient.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw new BusinessException({
      type: BusinessExceptionType.NOTIFICATION_NOT_FOUND,
    });
  }

  if (notification.recipientId !== userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTHORIZED_MODIFICATION,
    });
  }

  const updatedNotification = await prismaClient.notification.update({
    where: { id },
    data: { isRead: true },
  });

  res.send(updatedNotification);
};

export const markAllAsRead: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  await prismaClient.notification.updateMany({
    where: { recipientId: userId },
    data: { isRead: true },
  });

  res.send({ message: "모든 알림을 읽음으로 표시했습니다." });
};

export const removeNotification: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const notification = await prismaClient.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw new BusinessException({
      type: BusinessExceptionType.NOTIFICATION_NOT_FOUND,
    });
  }

  if (notification.recipientId !== userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTHORIZED_MODIFICATION,
    });
  }

  await prismaClient.notification.delete({
    where: { id },
  });

  res.send({ message: "알림을 삭제했습니다." });
};

export const getUnreadCount: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const unreadCount = await prismaClient.notification.count({
    where: { recipientId: userId, isRead: false },
  });

  res.send({ unreadCount });
};
