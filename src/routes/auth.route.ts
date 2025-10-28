import { Router } from "express";
import { signup, login, refresh } from "../controllers/auth.controller";
import { validateLogin, validateSignup } from "../middlewares/validator";

const router = Router();
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/refresh", refresh);
export default router;
