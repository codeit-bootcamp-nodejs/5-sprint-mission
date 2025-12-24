import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { validateUpdateMe, validateChangePassword} from "../middlewares/validator/validate.user";
import upload from "../middlewares/upload";
import { UserRepository } from "../repo/user.repository";
import { UserService } from "../service/user.service";
import { UserController } from "../controller/user.controller";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, validateUpdateMe, userController.updateMe);
router.patch(
  "/me/password",
  authMiddleware,
  validateChangePassword,
  userController.changePassword,
);
router.get("/me/products", authMiddleware, userController.getUserProducts);
router.get(
  "/me/liked-products",
  authMiddleware,
  userController.getLikedProducts,
);
router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  userController.uploadImage,
);

export default router;
