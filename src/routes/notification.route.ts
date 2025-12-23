import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);
router.get("/", notificationController.list);
router.patch("/:id/read", notificationController.read);

export default router;
