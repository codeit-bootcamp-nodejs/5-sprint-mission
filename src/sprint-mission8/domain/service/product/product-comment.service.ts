import { NotificationType } from "@prisma/client";
import { IProductCommentService } from "../../../inbound/port/services/product/product-comment.service.interface";
import { CreateProductCommentDto, DeleteProductCommentDto, GetProductCommentDto, UpdateProductCommentDto } from "../../../inbound/requests/product/product.req.schemas";
import { EXCEPTIONS } from "../../../shared/const/exception.info";
import { Exception } from "../../../shared/exception/exception";
import { CommentKeys, Sort } from "../../../types/query";
import { PersitstProductCommentEntity, ProductCommentEntity } from "../../entity/comment/product-comment.entity";
import { NotificationEntity } from "../../entity/notification.entity";
import { BaseService } from "../base.service";
import { NotificationCommentCreatedEvent } from "../../event/notification-comment-created.event copy";

export class ProductCommentService extends BaseService implements IProductCommentService {
  async getCommentList(dto: GetProductCommentDto): Promise<PersitstProductCommentEntity[]> {
    const { productId, cursor, limit, sort } = dto;

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

    if (!productId) {
      throw new Exception({ info: EXCEPTIONS.TARGETTYPE_NOT_EXIST });
    }

    const commentTotalCount = await this._repos.productComment.count(productId);

    if (commentTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: commentTotalCount });
    }

    const comments = await this._repos.productComment.findCommentList(
      productId,
      cursor,
      limit,
      orderBy,
    )
    if (!comments) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    return comments;
  };

  async createComment(dto: CreateProductCommentDto): Promise<PersitstProductCommentEntity> {

    const createCommentEntity = ProductCommentEntity.createNew(dto);

    const createdComment = await this._repos.productComment.create(createCommentEntity);

    if (!createdComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }

    const createNotification = NotificationEntity.createNew({
      userId: dto.userId,
      type: NotificationType.ARTICLE_COMMENT_CREATED,
      message: "작성한 게시글에 댓글이 달렸습니다.",
    });

    const notification = await this._repos.notification.save(createNotification);

    const notificationEventPayload = {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      message: notification.message,
      productId: createdComment.productId
    }

    this._utils.even.publish(
      new NotificationCommentCreatedEvent(notificationEventPayload),
    );

    return createdComment;
  };

  async updateComment(dto: UpdateProductCommentDto): Promise<PersitstProductCommentEntity> {

    const foundComment = await this._repos.productComment.findCommentById(
      dto.commentId
    );
    if (!foundComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    if (dto.userId !== foundComment.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_COMMENT_OWNER });
    }

    foundComment.updateContent(dto.content);

    const updatedComment = await this._repos.productComment.update(foundComment);

    if (!updatedComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }

    return updatedComment;
  };

  async deleteComment(dto: DeleteProductCommentDto): Promise<void> {
    const foundComment = await this._repos.productComment.findCommentById(dto.commentId);

    if (!foundComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    if (dto.userId !== foundComment.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_COMMENT_OWNER });
    }

    await this._repos.productComment.delete(dto.commentId);
  };
}