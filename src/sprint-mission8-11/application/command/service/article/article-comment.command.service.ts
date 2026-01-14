import { NotificationType } from "@prisma/client";
import {
  CreateArticleCommentDto,
  DeleteArticleCommentDto,
  GetArticleCommentDto,
  UpdateArticleCommentDto,
} from "../../../../inbound/requests/article/article.req.schemas";
import { CommentKeys, Sort } from "../../../../types/query";
import {
  PersitstArticleCommentEntity,
  ArticleCommentEntity,
} from "../../entity/comment/article-comment.entity";
import { NotificationEntity } from "../../entity/notification.entity";
import { NotificationCommentCreatedEvent } from "../../../event/notification-comment-created.event";
import { IArticleCommentCommandRepo } from "../../../port/repo/command/article/article-comment.command.repo.interface";
import { INotificationCommandRepo } from "../../../port/repo/command/notification.command.repo.interface";
import { IEventBusUtil } from "../../../../shared/utils/event-bus.util";
import { BusinessException } from "../../../../shared/exceptions/business.exception";
import { BusinessExceptionType } from "../../../../shared/const/business.exception.info";

export class ArticleCommentService {
  constructor(
    private readonly _articleCommentRepo: IArticleCommentCommandRepo,
    private readonly _notificationRepo: INotificationCommandRepo,
    private readonly _eventBusUtil: IEventBusUtil,
  ) {}

  async getCommentList(
    dto: GetArticleCommentDto,
  ): Promise<PersitstArticleCommentEntity[]> {
    const { articleId, cursor, limit, sort } = dto;

    const orderBy: { field: CommentKeys; sort: Sort } =
      sort === "recent"
        ? {
            field: "updatedAt",
            sort: "desc",
          }
        : sort === "id-desc"
          ? {
              field: "id",
              sort: "desc",
            }
          : {
              field: "id",
              sort: "asc",
            };

    if (limit > 20) {
      throw new BusinessException({ type: BusinessExceptionType.LIMIT_MAX_20 });
    }

    if (!articleId) {
      throw new BusinessException({
        type: BusinessExceptionType.TARGETTYPE_NOT_EXIST,
      });
    }

    const comments = await this._articleCommentRepo.findCommentList(
      articleId,
      cursor,
      limit,
      orderBy,
    );
    if (!comments) {
      throw new BusinessException({
        type: BusinessExceptionType.COMMENT_NOT_EXIST,
      });
    }
    return comments;
  }

  async createComment(
    dto: CreateArticleCommentDto,
  ): Promise<PersitstArticleCommentEntity> {
    const createCommentEntity = ArticleCommentEntity.createNew(dto);

    const createdComment =
      await this._articleCommentRepo.create(createCommentEntity);
    if (!createdComment) {
      throw new BusinessException({
        type: BusinessExceptionType.COMMENT_NOT_EXIST,
      });
    }

    const createNotification = NotificationEntity.createNew({
      userId: dto.userId,
      type: NotificationType.ARTICLE_COMMENT_CREATED,
      message: "작성한 게시글에 댓글이 달렸습니다.",
    });

    const notification = await this._notificationRepo.save(createNotification);

    const notificationEventPayload = {
      id: notification.id,
      userId: notification.userId,
      articleUserId: createdComment.articleUserId,
      type: notification.type,
      message: notification.message,
      productId: createdComment.articleId,
    };

    this._eventBusUtil.publish(
      new NotificationCommentCreatedEvent(notificationEventPayload),
    );

    return createdComment;
  }

  async updateComment(
    dto: UpdateArticleCommentDto,
  ): Promise<PersitstArticleCommentEntity> {
    const foundComment = await this._articleCommentRepo.findCommentById(
      dto.commentId,
    );
    if (!foundComment) {
      throw new BusinessException({
        type: BusinessExceptionType.COMMENT_NOT_EXIST,
      });
    }
    if (dto.userId !== foundComment.userId) {
      throw new BusinessException({
        type: BusinessExceptionType.UNAUTHORIZED_COMMENT_OWNER,
      });
    }

    foundComment.updateContent(dto.content);

    const updatedComment = await this._articleCommentRepo.update(foundComment);

    if (!updatedComment) {
      throw new BusinessException({
        type: BusinessExceptionType.COMMENT_NOT_EXIST,
      });
    }

    return updatedComment;
  }

  async deleteComment(dto: DeleteArticleCommentDto): Promise<void> {
    const foundComment = await this._articleCommentRepo.findCommentById(
      dto.commentId,
    );

    if (!foundComment) {
      throw new BusinessException({
        type: BusinessExceptionType.COMMENT_NOT_EXIST,
      });
    }
    if (dto.userId !== foundComment.userId) {
      throw new BusinessException({
        type: BusinessExceptionType.UNAUTHORIZED_COMMENT_OWNER,
      });
    }

    await this._articleCommentRepo.delete(dto.commentId);
  }
}
