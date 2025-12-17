import { BaseService } from "./base-service";
import { IRepository, PaginationQuery } from "../../outbound/repository";
import BadRequestError from "../../shared/errors/BadRequestError";
import UnauthorizedError from "../../shared/errors/UnauthorizedError";
import { ICommentService } from "../port/service/comment-service";
import { NotificationType } from "@prisma/client";

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

  async createProductComment(
    productId: number,
    userId: number,
    content: string,
  ) {
    const commentData = {
      productId,
      userId,
      content,
    };
    return await this.repository.comment.uploadProductComment(commentData);
  }

  async createArticleComment(
    articleId: number,
    userId: number,
    content: string,
  ) {
    const article = await this.repository.article.loadDetail(articleId);
    if (!article) {
      throw new BadRequestError("존재하지 않는 게시글입니다.");
    }

    const { comment, notification } =
      await this.repository.comment.uploadArticleCommentWithNotification({
        articleId,
        userId,
        content,
        notification: {
          targetUserId: article.userId!,
          type: NotificationType.NEW_COMMENT,
          title: "내 게시글에 새 댓글이 달렸습니다.",
          body: content,
          url: `/articles/${articleId}`,
          data: { articleId, commentPreview: content.slice(0, 100) },
        },
      });

    return { comment, notification };
  }

  async updateComment(commentId: number, userId: number, content: string) {
    const existing = await this.repository.comment.loadDetail(commentId);

    if (!existing) {
      throw new BadRequestError("존재하지 않는 댓글입니다.");
    }
    if (existing.userId !== userId) {
      throw new UnauthorizedError("댓글을 수정할 권한이 없습니다.");
    }

    const updateData = { content };
    return await this.repository.comment.editComment(commentId, updateData);
  }

  async deleteComment(commentId: number, userId: number) {
    const existing = await this.repository.comment.loadDetail(commentId);

    if (!existing) {
      throw new BadRequestError("존재하지 않는 댓글입니다.");
    }
    if (existing.userId !== userId) {
      throw new UnauthorizedError("댓글을 삭제할 권한이 없습니다.");
    }

    return await this.repository.comment.deleteComment(commentId);
  }

  getProductComments(productId: number, query: PaginationQuery) {
    const processedQuery = this.processQuery(query);
    return this.repository.comment.loadProductComments(
      productId,
      processedQuery,
    );
  }

  getArticleComments(articleId: number, query: PaginationQuery) {
    const processedQuery = this.processQuery(query);
    return this.repository.comment.loadArticleComments(
      articleId,
      processedQuery,
    );
  }
}
