import { Prisma, PrismaClient } from "@prisma/client";
import { ICommentRepository } from "../../domain/port/repository/commnet-repository";
import { BaseRepository } from "./base-repository";
import {
  CommentEntity,
  EditCommentAttrs,
  NewCommentAttrs,
} from "../../domain/entity/comment-entity";
import { PaginationQuery } from "../repository";
import { NotificationEntity } from "../../domain/entity/notification-entity";
import { NotificationType } from "@prisma/client";
import { createNotificationsTx } from "./notification-repository";

export class CommentRepository
  extends BaseRepository
  implements ICommentRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  uploadProductComment = async (
    data: NewCommentAttrs & { userId: number; productId: number },
  ) => {
    const comment = await this.prisma.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        productId: data.productId,
      },
    });
    return CommentEntity.fromPersisted(comment);
  };

  uploadArticleCommentWithNotification = async (params: {
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
  }) => {
    const { articleId, userId, content, notification } = params;

    const result = await this.prisma.$transaction(async (tx) => {
      const createdComment = await tx.comment.create({
        data: {
          content,
          userId,
          articleId,
        },
      });

      let notificationEntity: NotificationEntity | undefined;
      if (notification && notification.targetUserId !== userId) {
        const [createdNotification] = await createNotificationsTx(tx, [
          {
            userId: notification.targetUserId,
            type: notification.type,
            title: notification.title,
            body: notification.body ?? null,
            url: notification.url ?? null,
            data: notification.data,
          },
        ]);
        notificationEntity = createdNotification;
      }

      return {
        comment: CommentEntity.fromPersisted(createdComment),
        notification: notificationEntity,
      };
    });

    return result;
  };

  loadDetail = async (commentId: number) => {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return null;
    return CommentEntity.fromPersisted(comment);
  };

  editComment = async (commentId: number, data: EditCommentAttrs) => {
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: data,
    });
    return CommentEntity.fromPersisted(updatedComment);
  };

  deleteComment = async (commentId: number) => {
    await this.prisma.comment.delete({
      where: { id: commentId },
    });
  };

  loadProductComments = async (productId: number, query: PaginationQuery) => {
    const { offset = 0, limit = 10 } = query;

    const comments = await this.prisma.comment.findMany({
      where: { productId: productId },
      orderBy: { createdAt: "asc" },
      skip: offset,
      take: limit,
    });

    return comments.map(CommentEntity.fromPersisted);
  };

  loadArticleComments = async (articleId: number, query: PaginationQuery) => {
    const { offset = 0, limit = 10 } = query;

    const comments = await this.prisma.comment.findMany({
      where: { articleId: articleId },
      orderBy: { createdAt: "asc" },
      skip: offset,
      take: limit,
    });

    return comments.map(CommentEntity.fromPersisted);
  };
}
