import { Router } from "express";
import { UserController } from "../02-controller/user.controller.js";
import { requireAuth } from "../05-middleware/auth.middleware.js";

const router = Router();
const controller = new UserController();

router.get("/users/me", requireAuth, controller.me);
router.patch("/users/me", requireAuth, controller.updateProfile);
router.patch("/users/me/password", requireAuth, controller.changePassword);
router.get("/users/me/products", requireAuth, controller.myProducts);

export default router;
