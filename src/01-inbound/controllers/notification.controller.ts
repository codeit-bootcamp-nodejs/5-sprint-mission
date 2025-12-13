import { Request, Response } from "express";
import { AuthenticatorType } from "../../external/authenticator";
import { BaseController } from "./base.controller";
import { NotificationServiceType } from "../../02-domain/service/notification.service";






export const createNotificationController = (
    _service: NotificationServiceType,
    _auth: AuthenticatorType
) => {

    const { basePath, router, validate, errorHandler } = BaseController('/notifications')
    const service = _service;
    const auth = _auth;

    const registerRoutes = () => {
        // 알림 조회
        router.get(
            '/',
            errorHandler(auth.verifyAccessToken),
            errorHandler(getNotifications)
        );

        // 알림 한개 삭제
        router.delete(
            '/:id',
            errorHandler(auth.verifyAccessToken),
            errorHandler(deleteNotification)
        );

        // 알림 전체 삭제
        router.delete(
            '/',
            errorHandler(auth.verifyAccessToken),
            errorHandler(deleteAllNotifications)
        )
    }


    const getNotifications = async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const notifications = await service.getNotifications(userId);
        return res.json(notifications);
    }

    const deleteNotification = async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const id = req.params.id;
        await service.deleteNotification(userId, id);
        return res.status(200).json();
    }

    const deleteAllNotifications = async (req: Request, res: Response) => {
        const userId  = req.user.userId;
        
        await service.deleteAllNotifications(userId);
        return res.status(200).json();
    }

    registerRoutes();
    return {
        basePath,
        router
    };
}