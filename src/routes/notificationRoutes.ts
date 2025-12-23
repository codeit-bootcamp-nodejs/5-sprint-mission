import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth";

export const notificationRoutesFactory = (controller: any): Router => {
  const router = express.Router();

  router.get("/", authMiddleware, controller.getNotifications);
  router.get("/unread-count", authMiddleware, controller.getUnreadCount);
  router.patch("/:notificationId/read", authMiddleware, controller.markAsRead);

  return router;
};
