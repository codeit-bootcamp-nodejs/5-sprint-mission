import { PaginationQuery } from "../../../outbound/repository";
import { CommentEntity } from "../../entity/comment-entity";
import { PersistedNotificationEntity } from "../../entity/notification-entity";

export interface ICommentService {
  createProductComment: (
    productId: number,
    userId: number,
    content: string,
  ) => Promise<CommentEntity>;
  createArticleComment: (
    articleId: number,
    userId: number,
    content: string,
  ) => Promise<{
    comment: CommentEntity;
    notification?: PersistedNotificationEntity;
  }>;
  updateComment: (
    commentId: number,
    userId: number,
    content: string,
  ) => Promise<CommentEntity>;
  deleteComment: (commentId: number, userId: number) => Promise<void>;
  getProductComments: (
    productId: number,
    query: PaginationQuery,
  ) => Promise<CommentEntity[]>;
  getArticleComments: (
    articleId: number,
    query: PaginationQuery,
  ) => Promise<CommentEntity[]>;
}
