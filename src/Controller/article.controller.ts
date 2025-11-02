import { Request, Response, NextFunction } from "express";
import { ArticleService } from "../Service/article.service";
import { ArticleCreateDto } from "../dto/article.dto";

const articleService = new ArticleService();

export class ArticleController {
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articles = await articleService.list(req.query, req.user?.id);
      res.status(200).json(articles);
    } catch (e) {
      next(e);
    }
  };

  create = async (req: Request<{}, {}, ArticleCreateDto>, res: Response, next: NextFunction) => {
    try {
      const article = await articleService.create({ ...req.body, userId: req.user!.id });
      res.status(201).json(article);
    } catch (e) {
      next(e);
    }
  };

  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await articleService.detail(Number(req.params.id), req.user?.id);
      res.status(200).json(article);
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await articleService.update(Number(req.params.id), req.body, req.user!.id);
      res.status(200).json(article);
    } catch (e) {
      next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await articleService.remove(Number(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  like = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await articleService.like(Number(req.params.id), req.user!.id);
      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  };

  unlike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await articleService.unlike(Number(req.params.id), req.user!.id);
      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  };
}
