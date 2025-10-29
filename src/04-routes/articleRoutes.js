import express from "express";
import { authMiddleware } from "../05-middleware/auth.js";

export const articleRoutes = (articleController) => {
  const router = express.Router();

  router.post("/", authMiddleware, articleController.createArticle);
  router.get("/", authMiddleware, articleController.getArticles);
  router.post("/:articleId/like", authMiddleware, articleController.toggleLike);

  return router;
};
