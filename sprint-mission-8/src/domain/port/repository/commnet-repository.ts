import {
  EditCommentAttrs,
  NewCommentAttrs,
  PersistedCommentEntity,
} from "../../entity/comment-entity";
import { PersistedNotificationEntity } from "../../entity/notification-entity";
import { PaginationQuery } from "../../../outbound/repository";
import { NotificationType } from "@prisma/client";

export interface ICommentRepository {
  uploadProductComment(
    data: NewCommentAttrs & { userId: number; productId: number },
  ): Promise<PersistedCommentEntity>;
  uploadArticleCommentWithNotification: (params: {
    articleId: number;
    userId: number;
    content: string;
    notification?:
      | {
          targetUserId: number;
          type: NotificationType;
          title: string;
          body?: string | null;
          url?: string | null;
          data?: unknown;
        }
      | null;
  }) => Promise<{
    comment: PersistedCommentEntity;
    notification?: PersistedNotificationEntity;
  }>;
  loadDetail(commentId: number): Promise<PersistedCommentEntity | null>;
  editComment(
    commentId: number,
    data: EditCommentAttrs,
  ): Promise<PersistedCommentEntity>;
  deleteComment(commentId: number): Promise<void>;
  loadProductComments(
    productId: number,
    query: PaginationQuery,
  ): Promise<PersistedCommentEntity[]>;
  loadArticleComments(
    articleId: number,
    query: PaginationQuery,
  ): Promise<PersistedCommentEntity[]>;
}
