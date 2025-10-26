import express from "express";
import { CommentController } from "../controllers/comment-controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const commentController = new CommentController();

router.post(
  "/products/:productId/comments",
  authMiddleware,
  commentController.createProductComment,
);
router.get(
  "/products/:productId/comments",
  commentController.getProductComments,
);

router.post(
  "/articles/:articleId/comments",
  authMiddleware,
  commentController.createArticleComment,
);
router.get(
  "/articles/:articleId/comments",
  commentController.getArticleComments,
);

router.patch("/comments/:id", authMiddleware, commentController.updateComment);
router.delete("/comments/:id", authMiddleware, commentController.deleteComment);

export default router;
