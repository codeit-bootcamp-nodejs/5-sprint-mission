import { Request, Response, NextFunction } from "express";
import { CommentService } from "../Service/comment.service";

const commentService = new CommentService();

export class CommentController {
  listForProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await commentService.listForProduct(Number(req.params.productId));
      res.status(200).json(comments);
    } catch (e) {
      next(e);
    }
  };

  createForProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await commentService.createForProduct(
        Number(req.params.productId),
        req.body.content,
        req.user!.id
      );
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  };

  listForArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await commentService.listForArticle(Number(req.params.articleId));
      res.status(200).json(comments);
    } catch (e) {
      next(e);
    }
  };

  createForArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await commentService.createForArticle(
        Number(req.params.articleId),
        req.body.content,
        req.user!.id
      );
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await commentService.update(
        Number(req.params.id),
        req.body.content,
        req.user!.id
      );
      res.status(200).json(comment);
    } catch (e) {
      next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentService.remove(Number(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}
