import { NotificationController } from "../controllers/notification.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BaseRouter } from "./base.router";

export class NotificationRouter extends BaseRouter{
  constructor(
    private readonly _authMiddleware: AuthMiddleware,
    private readonly _notificationController: NotificationController
  ) {
    super("/api/notifications");
    this.registerNotificationRouter();
  }

  registerNotificationRouter = () => {
    this.router.patch(
      "/:notificationId/read",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._notificationController.markAsReadController),
    );
    this.router.get(
      "/unread-count",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._notificationController.getUnreadCountController),
    );
    this.router.get(
      "/",
      this.catchException(this._notificationController.getMyNotificationsController),
    );
  };
}