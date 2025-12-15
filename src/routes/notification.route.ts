import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);
router.get("/", notificationController.list);
router.get("/unread/count", notificationController.unreadCount);
router.patch("/:id/read", notificationController.read);

export default router;
