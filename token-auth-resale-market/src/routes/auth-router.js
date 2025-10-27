import express from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { SignUp, Login } from "../structs/auth.struct.js";

const router = express.Router();
const authController = new AuthController();

router.post("/signup", validate(SignUp), authController.signUp);
router.post("/login", validate(Login), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);


export default router;
