import { prisma } from "../lib/prisma";

export const notificationRepository = {
  create: (data: { userId: number; type: string; message: string }) =>
    prisma.notification.create({ data }),

  findByUser: (userId: number) =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),

  countUnread: (userId: number) =>
    prisma.notification.count({
      where: { userId, isRead: false },
    }),

  read: (id: number, userId: number) =>
    prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    }),
};
