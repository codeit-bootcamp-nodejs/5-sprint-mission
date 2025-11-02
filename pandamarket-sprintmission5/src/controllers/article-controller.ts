import { IService } from "../domain/service";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export interface IArticleController {
  handlerCreateArticle: (req: Request, res: Response) => Promise<void>;
  handlerGetArticles: (req: Request, res: Response) => Promise<void>;
  handlerGetArticleDetail: (req: Request, res: Response) => Promise<void>;
  handlerUpdateArticle: (req: Request, res: Response) => Promise<void>;
  handlerDeleteArticle: (req: Request, res: Response) => Promise<void>;
  handlerLikeArticle: (req: Request, res: Response) => Promise<void>;
  handlerUnlikeArticle: (req: Request, res: Response) => Promise<void>;
  handlerGetMyArticles: (req: Request, res: Response) => Promise<void>;
  handlerGetMyFavoriteArticles: (req: Request, res: Response) => Promise<void>;
}

export class ArticleController extends BaseController implements IArticleController {
  constructor(service: IService) {
    super(service)
  }

  handlerCreateArticle = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const article = await this.service.article.createArticle(userId, req.body);
    res.status(201).json({ message: "게시글이 등록되었습니다", data: article });
  };

  handlerGetArticles = async (req: Request, res: Response) => {
    const articles = await this.service.article.getArticles(req.query);
    res.json(articles);
  };

  handlerGetArticleDetail = async (req: Request, res: Response) => {
    const articleId = parseInt(req.params.id);
    if (isNaN(articleId)) {
      throw new Exception(400, "유효하지 않은 게시글 ID입니다")
    }

    const article = await this.service.article.getArticleById(articleId);
    res.json(article);
  };

  handlerUpdateArticle = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const articleId = parseInt(req.params.id);
    if (isNaN(articleId)) throw new Error("유효하지 않은 게시글 ID입니다");

    const updatedArticle = await this.service.article.updateArticle(
      articleId,
      userId,
      req.body,
    )

    res.status(200).json(updatedArticle);
  };

  handlerDeleteArticle = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const articleId = parseInt(req.params.id);
    if (isNaN(articleId)) {
      throw new Error("유효하지 않은 게시글 ID입니다")
    }

    await this.service.article.deleteArticle(articleId, userId);
    res.status(200).json({ message: "게시글이 삭제되었습니다" });
  };

  handlerLikeArticle = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const articleId = parseInt(req.params.id);
    if (isNaN(articleId)) {
      throw new Error("유효하지 않은 게시글 ID입니다")
    }
    const result = await this.service.article.likeArticle(articleId, userId);
    res.status(200).json(result);
  };

  handlerUnlikeArticle = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const articleId = parseInt(req.params.id);
    if (isNaN(articleId)) {
      throw new Error("유효하지 않은 게시글 ID입니다")
    }

    const result = await this.service.article.unlikeArticle(articleId, userId);
    res.json(result);
    res.status(200).json(result);
  };

  handlerGetMyArticles = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("인증이 필요합니다.");
    }

    const query = req.query;

    const articles = await this.service.article.loadMyArticles(userId, query);

    res.status(200).json(articles);
  };

  handlerGetMyFavoriteArticles = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const query = req.query;
    const articles = await this.service.article.getFavoriteArticles(userId, query);

    res.status(200).json(articles);
  };
}


