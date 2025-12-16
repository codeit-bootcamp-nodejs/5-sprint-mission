import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { validateSignUp, validateLogin, validateRefreshToken } from "../middlewares/validator/validate.auth";
import { UserRepository } from "../repo/user.repository";
import { AuthService } from "../service/auth.service";
import { AuthController } from "../controller/auth.controller";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = Router();

router.post("/signup", validateSignUp, authController.signUp);
router.post("/login", validateLogin, authController.logIn);
router.post("/token", validateRefreshToken, authController.token);
router.post("/logout", authMiddleware, authController.logOut);

export default router;
