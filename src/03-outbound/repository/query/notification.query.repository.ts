import { PrismaClient } from "@prisma/client";
import { INotificationQueryRepository } from "../../../02-application/port/repositories/query/I.notification.query.repository";
import { NotificationView } from "../../../02-application/query/view/notification.view";

export const createNotificationQueryRepository = (prisma: PrismaClient): INotificationQueryRepository => {
    const findAll = async (userId: string): Promise<NotificationView[]> => {
        const notifications = await prisma.notification.findMany({
            where: {
                receiverId: userId
            },
            include: {
                sender: true,
                receiver: true
            }
        });

        return notifications.map((notification) => {
            return {
                id: notification.id,
                type: notification.type,
                message: notification.message,
                read: notification.read,
                sender: {
                    nickname: notification.sender.nickname
                },
                receiver: {
                    nickname: notification.receiver?.nickname ?? ""
                },
                createdAt: notification.createdAt
            }
        })
    };
    return { findAll };
}