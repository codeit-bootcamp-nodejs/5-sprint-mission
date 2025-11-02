import { Router } from "express";
import { UserController } from "../Controller/user.controller";

const router = Router();
const controller = new UserController();

router.post("/auth/signup", controller.signup);
router.post("/auth/signin", controller.signin);
router.post("/auth/refresh", controller.refresh);

export default router;
