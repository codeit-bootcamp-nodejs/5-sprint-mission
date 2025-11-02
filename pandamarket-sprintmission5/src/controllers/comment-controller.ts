import { IService } from "../domain/service";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export interface ICommentController {
  handlerCreateProductComment: (req: Request, res: Response) => Promise<void>;
  handlerCreateArticleComment: (req: Request, res: Response) => Promise<void>;
  handlerUpdateComment: (req: Request, res: Response) => Promise<void>;
  handlerDeleteComment: (req: Request, res: Response) => Promise<void>;
  handlerGetProductComments: (req: Request, res: Response) => Promise<void>;
  handlerGetArticleComments: (req: Request, res: Response) => Promise<void>;
} 

export class CommentController extends BaseController implements ICommentController {
  constructor(service: IService) {
    super(service)
  }

  handlerCreateProductComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      throw new Error("유효하지 않은 게시글 ID입니다")
    }

    const { content } = req.body;
    if (!content) throw new Exception(400, "댓글 내용을 입력해주세요");

    const comment = await this.service.comment.createProductComment(
      productId,
      userId,
      content,
    );
    res.status(201).json(comment);
  };

  handlerCreateArticleComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const articleId = parseInt(req.params.id);
    if (isNaN(articleId)) {
      throw new Error("유효하지 않은 게시글 ID입니다")
    }

    const { content } = req.body;
    if (!articleId) throw new Exception(400, "유효하지 않은 게시글 ID입니다");
    if (!content) throw new Exception(400, "댓글 내용을 입력해주세요");
    const comment = await this.service.comment.createArticleComment(
      articleId,
      userId,
      content,
    );
    res.status(201).json(comment);
  };

  handlerUpdateComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const commentId = parseInt(req.params.id);
    if (isNaN(commentId)) {
      throw new Error("유효하지 않은 게시글 ID입니다")
    }

    const { content } = req.body;
    if (!commentId) throw new Exception(400, "유효하지 않은 댓글 ID입니다");
    if (!content) throw new Exception(400, "댓글 내용을 입력해주세요");
    const updatedComment = await this.service.comment.updateComment(
      commentId,
      userId,
      content,
    );
    res.status(200).json(updatedComment)
  };

  handlerDeleteComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error();
    }

    const commentId = parseInt(req.params.id);
    if (isNaN(commentId)) {
      throw new Error("유효하지 않은 게시글 ID입니다")
    }
    if (!commentId) throw new Exception(400, "유효하지 않은 댓글 ID입니다");
    await this.service.comment.deleteComment(commentId, userId);
    res.status(200).json({ message: "댓글이 삭제되었습니다" });
  };

  handlerGetProductComments = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId);
    const query = req.query;
    if (!productId) throw new Exception(400, "유효하지 않은 상품 ID입니다");

    const result = await this.service.comment.getProductComments(
      productId,
      query,
    );
    res.json(result);
  };

  handlerGetArticleComments = async (req: Request, res: Response) => {
    const articleId = parseInt(req.params.articleId);
    const query = req.query;
    if (!articleId) throw new Exception(400, "유효하지 않은 게시글 ID입니다");
    const result = await this.service.comment.getArticleComments(
      articleId,
      query,
    );
    res.json(result);
  };
}
