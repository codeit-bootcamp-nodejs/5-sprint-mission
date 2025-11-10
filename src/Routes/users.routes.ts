import { Router } from "express";
import { UserController } from "../Controller/user.controller";
import { requireAuth } from "../Middleware/auth.middleware";

const router = Router();
const controller = new UserController();

router.get("/users/me", requireAuth, controller.me);
router.patch("/users/me", requireAuth, controller.updateProfile);
router.patch("/users/me/password", requireAuth, controller.changePassword);

export default router;
