import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../service/notificationService";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 알림 목록 조회
  getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const notifications =
        await this.notificationService.getNotifications(userId);

      res.json(notifications);
    } catch (err) {
      next(err);
    }
  };

  // 안 읽은 알림 개수 조회
  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const count = await this.notificationService.getUnreadCount(userId);

      res.json({ count });
    } catch (err) {
      next(err);
    }
  };

  // 알림 읽음 처리
  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { notificationId } = req.params;

      await this.notificationService.markAsRead(notificationId, userId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}