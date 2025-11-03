import { BaseService } from "./base-service";
import { IRepository, PaginationQuery } from "../../repositories/repository";
import BadRequestError from "../../lib/errors/BadRequestError";
import UnauthorizedError from "../../lib/errors/UnauthorizedError";

interface ICommentService {}


export class CommentService extends BaseService implements ICommentService {
  constructor(repository: IRepository) {
    super(repository);
  }

  private processQuery(query: PaginationQuery) {
    return {
      ...query,
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };
  }

  createProductComment(
    productId: number,
    userId: number,
    content: string,
  ) {
    const commentData = {
      productId,
      userId,
      content,
    };
    return this.repository.comment.uploadProductComment(commentData);
  }

  createArticleComment(
    articleId: number,
    userId: number,
    content: string,
  ) {
    const commentData = {
      articleId,
      userId,
      content,
    };
    return this.repository.comment.uploadArticleComment(commentData);
  }

  updateComment(
    commentId: number,
    userId: number,
    content: string,
  ) {
    const existing = this.repository.comment.loadDetail(commentId);

    if (!existing) {
      throw new BadRequestError("존재하지 않는 댓글입니다.");
    }
    if (existing.userId !== userId) {
      throw new UnauthorizedError("댓글을 수정할 권한이 없습니다.");
    }

    const updateData = { content };
    return this.repository.comment.editComment(commentId, updateData);
  }

  deleteComment(
    commentId: number,
    userId: number,
  ) {
    const existing = this.repository.comment.loadDetail(commentId);

    if (!existing) {
      throw new BadRequestError("존재하지 않는 댓글입니다.");
    }
    if (existing.userId !== userId) {
      throw new UnauthorizedError("댓글을 삭제할 권한이 없습니다.");
    }

    return this.repository.comment.deleteComment(commentId);
  }

  getProductComments(
    productId: number,
    query: PaginationQuery,
  ) {
    const processedQuery = this.processQuery(query);
    return this.repository.comment.loadProductComments(productId, processedQuery);
  }

  getArticleComments(
    articleId: number,
    query: PaginationQuery,
  ) {
    const processedQuery = this.processQuery(query);
    return this.repository.comment.loadArticleComments(articleId, processedQuery);
  }
}