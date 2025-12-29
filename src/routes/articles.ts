import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authOptionalMiddleware from "../middlewares/auth.optional.middleware";
import { validateArticle } from "../middlewares/validator/validate.article";
import { ArticleRepository } from "../repo/article.repository";
import { ArticleService } from "../service/article.service";
import { ArticleController } from "../controller/article.controller";

const articleRepository = new ArticleRepository();
const articleService = new ArticleService(articleRepository);
const articleController = new ArticleController(articleService);

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateArticle,
  articleController.createArticle,
);
router.get("/", authOptionalMiddleware, articleController.getArticles);
router.get("/:id", authOptionalMiddleware, articleController.getArticleById);
router.patch(
  "/:id",
  authMiddleware,
  validateArticle,
  articleController.updateArticle,
);
router.delete("/:id", authMiddleware, articleController.deleteArticle);
router.post("/:id/like", authMiddleware, articleController.toggleArticleLike);

export default router;
