import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middlewares/auth";

import * as c from "../controllers/comment.controller";
import { parseIdParam } from "@/middlewares/params";
import {
  validateCreateComment,
  validateUpdateComment,
} from "@/middlewares/validator";

const router = Router({ mergeParams: true });

router.get(
  "/",
  optionalAuthenticate,
  parseIdParam("articleId"),
  c.listForArticle,
);

router.post(
  "/",
  authenticate,
  parseIdParam("articleId"),
  validateCreateComment,
  c.createForArticle,
);

router.patch(
  "/:commentId",
  authenticate,
  parseIdParam("commentId"),
  validateUpdateComment,
  c.update,
);
router.delete("/:commentId", authenticate, parseIdParam("commentId"), c.remove);

export default router;
