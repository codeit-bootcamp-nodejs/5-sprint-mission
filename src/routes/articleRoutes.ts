import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth";

export const articleRoutesFactory = (articleController: any): Router => {
  const router = express.Router();

  router.post("/", authMiddleware, articleController.createArticle);
  router.get("/", authMiddleware, articleController.getArticles);
  router.post("/:articleId/like", authMiddleware, articleController.toggleLike);

  return router;
};