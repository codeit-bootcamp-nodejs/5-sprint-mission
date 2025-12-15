import type { Request, Response, NextFunction } from "express";
import type { CommentService } from "../service/commentService";
import { CreateCommentDto } from "../common/dto";

export class CommentController {
  #commentService: CommentService;
  constructor(commentService: CommentService) {
    this.#commentService = commentService;
  }

  createProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const { productId, content } = req.body as CreateCommentDto;
      const comment = await this.#commentService.createProductComment(
        userId,
        productId!,
        content,
      );
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  };

  createArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const { articleId, content } = req.body as CreateCommentDto;
      const comment = await this.#commentService.createArticleComment(
        userId,
        articleId!,
        content,
      );
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { commentId } = req.params;
      const { content } = req.body as { content: string };
      const updated = await this.#commentService.updateComment(
        userId,
        commentId,
        content,
      );
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { commentId } = req.params;
      await this.#commentService.deleteComment(userId, commentId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
