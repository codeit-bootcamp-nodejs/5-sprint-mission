import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller";
import { validateLogin, validateSignup } from "../middlewares/validator";

const router = Router();

router.post("/signup", validateSignup, authCtrl.signup);
router.post("/login", validateLogin, authCtrl.login);
router.post("/refresh", authCtrl.refresh);

export default router;
