import { Router } from "express";
import { CommentController } from "../02-controller/comment.controller.js";
import { validateCommentCreateForArticle, validateCommentCreateForProduct } from "../05-middleware/validate.middleware.js";

const router = Router();
const controller = new CommentController();

router
  .route('/products/:productId/comments')
  .get(controller.listForProduct)
  .post(validateCommentCreateForProduct, controller.createForProduct);

router
  .route('/articles/:articleId/comments')
  .get(controller.listForArticle)
  .post(validateCommentCreateForArticle, controller.createForArticle);

router
  .route('/comments/:id')
  .patch(controller.update)
  .delete(controller.remove);

export default router;
