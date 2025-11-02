import { Router } from "express";
import * as articleCtrl from "../controllers/article.controller";
import { authenticate, optionalAuthenticate } from "../middlewares/auth";
import {
  validateCreateArticle,
  validateUpdateArticle,
} from "@/middlewares/validator";
import { parseIdParam } from "@/middlewares/params";

const router = Router();

router.get("/", optionalAuthenticate, articleCtrl.list);
router.get(
  "/:id",
  optionalAuthenticate,
  parseIdParam("id"),
  articleCtrl.getById,
);

router.post("/", authenticate, validateCreateArticle, articleCtrl.create);
router.patch(
  "/:id",
  authenticate,
  parseIdParam("id"),
  validateUpdateArticle,
  articleCtrl.update,
);
router.delete("/:id", authenticate, parseIdParam("id"), articleCtrl.remove);

router.post("/:id/like", authenticate, parseIdParam("id"), articleCtrl.like);
router.delete(
  "/:id/like",
  authenticate,
  parseIdParam("id"),
  articleCtrl.unlike,
);

export default router;
