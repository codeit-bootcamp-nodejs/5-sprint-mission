import express from "express";
import { authMiddleware } from "../05-middleware/auth.js";

export const commentRoutes = (commentController) => {
  const router = express.Router();

  router.post("/product", authMiddleware, commentController.createProductComment);
  router.post("/article", authMiddleware, commentController.createArticleComment);
  router.put("/:commentId", authMiddleware, commentController.updateComment);
  router.delete("/:commentId", authMiddleware, commentController.deleteComment);

  return router;
};
