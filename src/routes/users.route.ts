import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";
import { asValidated, requireKeys } from "../middlewares/validator";
import { UpdateMeDTO, ChangePasswordDTO } from "../types/dto";

const router = Router();

router.get("/me", authenticate, userCtrl.me);

router.patch(
  "/me",
  authenticate,
  asValidated<UpdateMeDTO>(),
  userCtrl.updateMe,
);

router.patch(
  "/me/password",
  authenticate,
  requireKeys(["currentPassword", "newPassword"]),
  asValidated<ChangePasswordDTO>(),
  userCtrl.changePassword,
);

router.get("/me/likes/products", authenticate, userCtrl.myLikedProducts);

export default router;
