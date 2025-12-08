import { Request, Response, NextFunction } from "express";
import { CommentService } from "../service/comment.service";
import { HttpError } from "../middlewares/error.handler";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";

export class CommentController {
  private commentService;
  
  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  createProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.productId);
      const data: CreateCommentDto = req.body;

      if (isNaN(productId)) {
        throw new HttpError(400, "유효하지 않은 상품 ID입니다.");
      }

      const comment = await this.commentService.createProductComment(
        data,
        userId,
        productId,
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  getProductComments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const productId = Number(req.params.productId);
      const cursor = Number(req.query.cursor) || undefined;
      const limit = Number(req.query.limit) || 5;

      if (isNaN(productId)) {
        throw new HttpError(400, "유효하지 않은 상품 ID입니다.");
      }

      const comments = await this.commentService.getProductComments(
        productId,
        cursor,
        limit,
      );
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  updateProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const commentId = Number(req.params.commentId);
      const data: UpdateCommentDto = req.body;

      if (isNaN(commentId)) {
        throw new HttpError(400, "유효하지 않은 댓글 ID입니다.");
      }

      const updatedComment = await this.commentService.updateProductComment(
        commentId,
        userId,
        data,
      );
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  deleteProductComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const commentId = Number(req.params.commentId);

      if (isNaN(commentId)) {
        throw new HttpError(400, "유효하지 않은 댓글 ID입니다.");
      }

      await this.commentService.deleteProductComment(commentId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  createArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const articleId = Number(req.params.articleId);
      const data: CreateCommentDto = req.body;

      if (isNaN(articleId)) {
        throw new HttpError(400, "유효하지 않은 게시글 ID입니다.");
      }

      const comment = await this.commentService.createArticleComment(
        data,
        userId,
        articleId,
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  };

  getArticleComments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const articleId = Number(req.params.articleId);
      const cursor = Number(req.query.cursor) || undefined;
      const limit = Number(req.query.limit) || 5;

      if (isNaN(articleId)) {
        throw new HttpError(400, "유효하지 않은 게시글 ID입니다.");
      }

      const comments = await this.commentService.getArticleComments(
        articleId,
        cursor,
        limit,
      );
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  updateArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const commentId = Number(req.params.commentId);
      const data: UpdateCommentDto = req.body;

      if (isNaN(commentId)) {
        throw new HttpError(400, "유효하지 않은 댓글 ID입니다.");
      }

      const updatedComment = await this.commentService.updateArticleComment(
        commentId,
        userId,
        data,
      );
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  deleteArticleComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const commentId = Number(req.params.commentId);

      if (isNaN(commentId)) {
        throw new HttpError(400, "유효하지 않은 댓글 ID입니다.");
      }

      await this.commentService.deleteArticleComment(commentId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
