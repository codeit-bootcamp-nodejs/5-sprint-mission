import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AuthenticatorType } from "../../shared/authenticator/authenticator";
import { NotificationCommandServiceType } from "../../02-application/command/service/notification.command.service";
import { NotificationQueryServiceType } from "../../02-application/query/service/notification.query.service";


export const createNotificationController = (
  _notificationCommandService: NotificationCommandServiceType,
  _notificationQueryService: NotificationQueryServiceType,
  _auth: AuthenticatorType,
) => {
  const { basePath, router, validate, errorHandler } =
    BaseController("/notifications");
  const notificationCommandService = _notificationCommandService;
  const notificationQueryService = _notificationQueryService;
  const auth = _auth;

  const registerRoutes = () => {
    // 읽지 않은 모든 알림 조회
    router.get(
      "/",
      errorHandler(auth.verifyAccessToken),
      errorHandler(getNotifications),
    );

    // 알림 읽음 처리
    router.patch(
      "/:id",
      errorHandler(auth.verifyAccessToken),
      errorHandler(readNotification),
    );

    // 특정 알림 삭제
    router.delete(
      "/:id",
      errorHandler(auth.verifyAccessToken),
      errorHandler(deleteNotification),
    );

    // 알림 전체 삭제
    router.delete(
      "/",
      errorHandler(auth.verifyAccessToken),
      errorHandler(deleteAllNotifications),
    );
  };

  const getNotifications = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const notifications = await notificationQueryService.getNotifications(userId);
    return res.json(notifications);
  };

  const readNotification = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const id = req.params.id;
    const notifications = await notificationCommandService.readNotification(userId, id);
    return res.json(notifications);
  };

  const deleteNotification = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const id = req.params.id;
    await notificationCommandService.deleteNotification(userId, id);
    return res.status(200).json();
  };

  const deleteAllNotifications = async (req: Request, res: Response) => {
    const userId = req.user.userId;
    await notificationCommandService.deleteAllNotifications(userId);
    return res.status(200).json();
  };

  registerRoutes();
  return {
    basePath,
    router,
  };
};
