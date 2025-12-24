import { NotificationType } from "@prisma/client";
import { IArticleCommentService } from "../../../inbound/port/services/article/article-comment.service.interface";
import { CreateArticleCommentDto, DeleteArticleCommentDto, GetArticleCommentDto, UpdateArticleCommentDto } from "../../../inbound/requests/article/article.req.schemas";
import { EXCEPTIONS } from "../../../shared/const/exception.info";
import { Exception } from "../../../shared/exception/exception";
import { CommentKeys, Sort } from "../../../types/query";
import { PersitstArticleCommentEntity, ArticleCommentEntity } from "../../entity/comment/article-comment.entity";
import { NotificationEntity } from "../../entity/notification.entity";
import { NotificationCommentCreatedEvent } from "../../event/notification-comment-created.event";
import { IArticleCommentRepo } from "../../port/repo/article/article-comment.repo.interface";
import { INotificationRepo } from "../../port/repo/notification.repo.interface";
import { IEventBusUtil } from "../../../shared/util/event-bus.util";

export class ArticleCommentService implements IArticleCommentService {
  constructor(
    private readonly _articleCommentRepo: IArticleCommentRepo,
    private readonly _notificationRepo: INotificationRepo,
    private readonly _eventBusUtil: IEventBusUtil
  ) { }

  async getCommentList(dto: GetArticleCommentDto): Promise<PersitstArticleCommentEntity[]> {
    const { articleId, cursor, limit, sort } = dto;

    const orderBy: { field: CommentKeys; sort: Sort; } =
      sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        } : sort === "id-desc"
          ? {
            field: "id",
            sort: "desc"
          }
          : {
            field: "id",
            sort: "asc"
          };

    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    if (!articleId) {
      throw new Exception({ info: EXCEPTIONS.TARGETTYPE_NOT_EXIST });
    }

    const comments = await this._articleCommentRepo.findCommentList(
      articleId,
      cursor,
      limit,
      orderBy,
    )
    if (!comments) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    return comments;
  };

  async createComment(dto: CreateArticleCommentDto): Promise<PersitstArticleCommentEntity> {

    const createCommentEntity = ArticleCommentEntity.createNew(dto);

    const createdComment = await this._articleCommentRepo.create(createCommentEntity);
    if (!createdComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }

    const createNotification = NotificationEntity.createNew({
      userId: dto.userId,
      type: NotificationType.ARTICLE_COMMENT_CREATED,
      message: "작성한 게시글에 댓글이 달렸습니다.",
    })

    const notification = await this._notificationRepo.save(createNotification);

    const notificationEventPayload = {
      id: notification.id,
      userId: notification.userId,
      articleUserId: createdComment.articleUserId,
      type: notification.type,
      message: notification.message,
      productId: createdComment.articleId
    }

    this._eventBusUtil.publish(
      new NotificationCommentCreatedEvent(notificationEventPayload),
    );

    return createdComment;
  };

  async updateComment(dto: UpdateArticleCommentDto): Promise<PersitstArticleCommentEntity> {

    const foundComment = await this._articleCommentRepo.findCommentById(
      dto.commentId
    );
    if (!foundComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    if (dto.userId !== foundComment.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_COMMENT_OWNER });
    }

    foundComment.updateContent(dto.content);

    const updatedComment = await this._articleCommentRepo.update(foundComment);

    if (!updatedComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }

    return updatedComment;
  };

  async deleteComment(dto: DeleteArticleCommentDto): Promise<void> {
    const foundComment = await this._articleCommentRepo.findCommentById(dto.commentId);

    if (!foundComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    if (dto.userId !== foundComment.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_COMMENT_OWNER });
    }

    await this._articleCommentRepo.delete(dto.commentId);
  };
}