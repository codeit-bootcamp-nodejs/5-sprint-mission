import type { Request, Response, NextFunction } from "express";
import type { ArticleService } from "../service/articleService";
import { CreateArticleDTO } from "../common/dto";

export class ArticleController {
  #articleService: ArticleService;
  constructor(articleService: ArticleService) {
    this.#articleService = articleService;
  }

  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const payload = req.body as CreateArticleDTO;
      const article = await this.#articleService.createArticle(userId, payload);
      res.status(201).json(article);
    } catch (err) { next(err); }
  };

  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const articles = await this.#articleService.getArticles(userId ?? null);
      res.status(200).json(articles);
    } catch (err) { next(err); }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { articleId } = req.params;
      const like = await this.#articleService.toggleLike(userId, articleId);
      res.status(200).json(like);
    } catch (err) { next(err); }
  };
}
