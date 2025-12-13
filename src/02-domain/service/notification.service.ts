import { NotificationResDto } from "../../01-inbound/response/notification.response";
import { IBaseRepository } from "../port/I.base.repository";






export const createNotificationService = (
    repos: IBaseRepository
) => {


    const getNotifications = async (userId: string) => {
        const notifications = await repos.notification.findAll(userId);
        return notifications.map((entity) => new NotificationResDto(entity));
    }



    const deleteNotification = async (userId: string, id: string) => {
        const notification = await repos.notification.findById(id);

        if (!notification) {
            throw new Error('삭제할 알림이 존재하지 않습니다.');
        }

        if (notification.receiverId !== userId) {
            throw new Error("알림을 삭제할 권한이 없습니다.");
        }

        await repos.notification.remove(id);
    }

    const deleteAllNotifications = async (userId: string) => {
        await repos.notification.removeAll(userId);
    }


    return {
        getNotifications,
        deleteNotification,
        deleteAllNotifications
    }
}

export type NotificationServiceType = ReturnType<typeof createNotificationService>;