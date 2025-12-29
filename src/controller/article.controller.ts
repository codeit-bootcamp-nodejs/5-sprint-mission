import { Request, Response, NextFunction } from "express";
import { ArticleService } from "../service/article.service";
import { HttpError } from "../middlewares/error.handler";
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleListQueryDto,
} from "../dto/article.dto";

export class ArticleController {
  private articleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data: CreateArticleDto = req.body;

      const newArticle = await this.articleService.createArticle(userId, data);
      res.status(201).json(newArticle);
    } catch (error) {
      next(error);
    }
  };

  getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      const {
        offset: offsetQuery,
        limit: limitQuery,
        keyword: keywordQuery,
        sort: sortQuery,
      } = req.query;

      const offset = Number(offsetQuery) || 0;
      const limit = Number(limitQuery) || 10;
      const keyword = String(keywordQuery || "");

      const sort: "recent" | "asc" = sortQuery === "asc" ? "asc" : "recent";

      const queryDto: ArticleListQueryDto = {
        offset,
        limit,
        keyword,
        sort,
      };

      const articles = await this.articleService.getArticles(queryDto, userId);
      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  };

  getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const articleId = Number(req.params.id);

      if (isNaN(articleId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      const article = await this.articleService.getArticleById(
        articleId,
        userId,
      );
      res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  };

  updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.id);
      const data: UpdateArticleDto = req.body;

      if (isNaN(articleId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      const updatedArticle = await this.articleService.updateArticle(
        articleId,
        userId,
        data,
      );
      res.status(200).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  };

  deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.id);

      if (isNaN(articleId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      await this.articleService.deleteArticle(articleId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleArticleLike = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.id);

      if (isNaN(articleId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      const result = await this.articleService.toggleArticleLike(
        articleId,
        userId,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
