import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { NotificationRepository } from "../repo/notification.repository";
import { NotificationService } from "../service/notification.service";
import { NotificationController } from "../controller/notification.controller";
import { notificationGateway } from "../gateway/notification.gateway";
import { validateNotificationId } from "../middlewares/validator/validate.notification";

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository, notificationGateway);
const notificationController = new NotificationController(notificationService);

const router = Router();

router.get(
  "/",
  authMiddleware,
  notificationController.getNotifications
);

router.get(
  "/unread-count",
  authMiddleware,
  notificationController.getUnreadCount
);

router.patch(
  "/:id/read",
  authMiddleware,
  validateNotificationId,
  notificationController.readNotification
);

export default router;
