import express from "express";
import { withAsync } from "../../common/lib/withAsync";
import { authMiddleware } from "../../common/lib/auth.middleware";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  getUnreadCount,
} from "../controllers/notifications.controller";

const notificationsRouter = express.Router();

notificationsRouter.get("/", authMiddleware, withAsync(getNotifications));
notificationsRouter.get("/unread", authMiddleware, withAsync(getUnreadCount));
notificationsRouter.patch(
  "/read-all",
  authMiddleware,
  withAsync(markAllAsRead),
);
notificationsRouter.patch("/:id", authMiddleware, withAsync(markAsRead));
notificationsRouter.delete(
  "/:id",
  authMiddleware,
  withAsync(removeNotification),
);

export default notificationsRouter;
