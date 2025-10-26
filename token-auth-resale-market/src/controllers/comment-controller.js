import { CommentService } from "../services/comment-service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CommentController {
  constructor() {
    this.commentService = new CommentService(prisma);
  }

  createProductComment = async (req, res) => {
    const productId = parseInt(req.params.productId);
    const userId = req.user.userId;
    const { content } = req.body;
    if (!productId) throw new Exception(400, "유효하지 않은 상품 ID입니다");
    if (!content) throw new Exception(400, "댓글 내용을 입력해주세요");

    const comment = await this.commentService.createProductComment(
      productId,
      userId,
      content
    );
    res.json(comment);
  };

  createArticleComment = async (req, res) => {
    const articleId = parseInt(req.params.articleId);
    const userId = req.user.userId;
    const { content } = req.body;
    if (!articleId) throw new Exception(400, "유효하지 않은 게시글 ID입니다");
    if (!content) throw new Exception(400, "댓글 내용을 입력해주세요");
    const comment = await this.commentService.createArticleComment(
      articleId,
      userId,
      content
    );
    res.json(comment)
  };

  updateComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { content } = req.body;
    if (!commentId) throw new Exception(400, "유효하지 않은 댓글 ID입니다");
    if (!content) throw new Exception(400, "댓글 내용을 입력해주세요");
    const updatedComment = await this.commentService.updateComment(
      commentId,
      userId,
      content
    );
    res.json(updatedComment);
  };

  deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    const userId = req.user.userId;
    if (!commentId) throw new Exception(400, "유효하지 않은 댓글 ID입니다");
    await this.commentService.deleteComment(commentId, userId);
    res.json({ message: "댓글이 삭제되었습니다" });
  };


  getProductComments = async (req, res) => {
    const productId = parseInt(req.params.productId);
    const query = req.query;
    if (!productId) throw new Exception(400, "유효하지 않은 상품 ID입니다");

    const result = await this.commentService.getProductComments(
      productId,
      query,
    );
    res.json(result);
  };

  getArticleComments = async (req, res) => {
    const articleId = parseInt(req.params.articleId);
    const query = req.query;
    if (!articleId) throw new Exception(400, "유효하지 않은 게시글 ID입니다");
    const result = await this.commentService.getArticleComments(
      articleId,
      query,
    );
    res.json(result);
  };
}
