import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth";

export const commentRoutesFactory = (commentController: any): Router => {
  const router = express.Router();

  router.post(
    "/product",
    authMiddleware,
    commentController.createProductComment,
  );
  router.post(
    "/article",
    authMiddleware,
    commentController.createArticleComment,
  );
  router.put("/:commentId", authMiddleware, commentController.updateComment);
  router.delete("/:commentId", authMiddleware, commentController.deleteComment);

  return router;
};
