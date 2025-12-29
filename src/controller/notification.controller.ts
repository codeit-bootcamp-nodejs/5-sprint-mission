import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../service/notification.service";

export class NotificationController {
  private _notificationService;

  constructor(notificationService: NotificationService) {
    this._notificationService = notificationService;
  }

  getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const result = await this._notificationService.getNotifications(userId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  readNotification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const notificationId = Number(req.params.id);
      await this._notificationService.readNotification(notificationId, userId);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
