import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  me,
  updateMe,
  changePassword,
  likedProducts,
} from "../controllers/user.controller";

const router = Router();
router.get("/me", authenticate, me);
router.patch("/me", authenticate, updateMe);
router.patch("/me/password", authenticate, changePassword);
router.get("/me/likes/products", authenticate, likedProducts);
export default router;
