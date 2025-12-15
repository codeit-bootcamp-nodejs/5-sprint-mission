import { IUtils } from "../../shared/util";
import { Controllers } from "../controllers";
import { BaseRouter } from "./base.router";

export class NotificationRouter extends BaseRouter{
  constructor(controllers: Controllers, utils: IUtils) {
    super("/api/notifications", controllers, utils);
    this.registerNotificationRouter();
  }

  registerNotificationRouter = () => {
    this.router.patch(
      "/:notificationId/read",
      this.isAuthenticate,
      this.catchException(this.controllers.notification.markAsReadController),
    );
    this.router.get(
      "/unread-count",
      this.isAuthenticate,
      this.catchException(this.controllers.notification.getUnreadCountController),
    );
    this.router.get(
      "/",
      this.catchException(this.controllers.notification.getMyNotificationsController),
    );
  };
}