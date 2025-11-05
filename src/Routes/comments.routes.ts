import { Router } from "express";
import { CommentController } from "../Controller/comment.controller";
import { requireAuth } from "../Middleware/auth.middleware";
import {
  validateCommentCreateForProduct,
  validateCommentCreateForArticle,
} from "../Middleware/validate.middleware";

const router = Router();
const controller = new CommentController();

router
  .route("/products/:productId/comments")
  .get(controller.listForProduct)
  .post(requireAuth, validateCommentCreateForProduct, controller.createForProduct);

router
  .route("/articles/:articleId/comments")
  .get(controller.listForArticle)
  .post(requireAuth, validateCommentCreateForArticle, controller.createForArticle);

router
  .route("/comments/:id")
  .patch(requireAuth, controller.update)
  .delete(requireAuth, controller.remove);

export default router;
