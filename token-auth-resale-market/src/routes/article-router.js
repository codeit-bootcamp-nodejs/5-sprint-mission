import express from "express";
import { ArticleController } from "../controllers/article-controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const articleController = new ArticleController();

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleDetail);
router.post("/", authMiddleware, articleController.createArticle);
router.patch("/:id", authMiddleware, articleController.updateArticle);
router.delete("/:id", authMiddleware, articleController.deleteArticle);
router.post("/:id/like", authMiddleware, articleController.likeArticle);
router.delete("/:id/like", authMiddleware, articleController.unlikeArticle);

export default router;
