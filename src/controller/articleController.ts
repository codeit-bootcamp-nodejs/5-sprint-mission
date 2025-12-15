import { Request, Response, NextFunction } from "express";
import { ArticleService } from "../service/articleService";

export class ArticleController {
  constructor(private articleService: ArticleService) {}

  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { title, content } = req.body;

      const article = await this.articleService.createArticle(
        userId,
        title,
        content,
      );

      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  };

  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articles = await this.articleService.getArticles();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { articleId } = req.params;

      const result = await this.articleService.toggleLike(articleId, userId);

      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
