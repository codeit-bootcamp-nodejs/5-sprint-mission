import express from "express";
import { UserController } from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const userController = new UserController();

router.get("/me", authMiddleware, userController.getMyInfo);
router.patch("/me", authMiddleware, userController.updateMyInfo);
router.patch("/me/password", authMiddleware, userController.changePassword);
router.get("/me/products", authMiddleware, userController.getMyProducts);

export default router;
