import { IProductCommentService } from "../../../inbound/port/services/product/product-comment.service.interface";
import {
  CreateProductCommentDto,
  DeleteProductCommentDto,
  GetProductCommentDto,
  UpdateProductCommentDto,
} from "../../../inbound/requests/product/product.req.schemas";
import { CommentKeys, Sort } from "../../../types/query";
import {
  PersitstProductCommentEntity,
  ProductCommentEntity,
} from "../../entity/comment/product-comment.entity";
import { IProductCommentRepo } from "../../port/repo/product/product-comment.repo.interface";
import { INotificationRepo } from "../../port/repo/notification.repo.interface";
import { IEventBusUtil } from "../../../shared/utils/event-bus.util";
import { BusinessExceptionType } from "../../../shared/const/business.exception.info";
import { BusinessException } from "../../../shared/exceptions/business.exception";

export class ProductCommentService implements IProductCommentService {
  constructor(
    private readonly _productCommentRepo: IProductCommentRepo,
    private readonly _notificationRepo: INotificationRepo,
    private readonly _evenBusUtil: IEventBusUtil,
  ) {}
  async getCommentList(
    dto: GetProductCommentDto,
  ): Promise<PersitstProductCommentEntity[]> {
    const { productId, cursor, limit, sort } = dto;

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

    if (!productId) {
      throw new BusinessException({
        type: BusinessExceptionType.TARGETTYPE_NOT_EXIST,
      });
    }

    const comments = await this._productCommentRepo.findCommentList(
      productId,
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
    dto: CreateProductCommentDto,
  ): Promise<PersitstProductCommentEntity> {
    const createCommentEntity = ProductCommentEntity.createNew(dto);

    const createdComment =
      await this._productCommentRepo.create(createCommentEntity);

    if (!createdComment) {
      throw new BusinessException({
        type: BusinessExceptionType.COMMENT_NOT_EXIST,
      });
    }
    return createdComment;
  }

  async updateComment(
    dto: UpdateProductCommentDto,
  ): Promise<PersitstProductCommentEntity> {
    const foundComment = await this._productCommentRepo.findCommentById(
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

    const updatedComment = await this._productCommentRepo.update(foundComment);

    if (!updatedComment) {
      throw new BusinessException({
        type: BusinessExceptionType.COMMENT_NOT_EXIST,
      });
    }

    return updatedComment;
  }

  async deleteComment(dto: DeleteProductCommentDto): Promise<void> {
    const foundComment = await this._productCommentRepo.findCommentById(
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

    await this._productCommentRepo.delete(dto.commentId);
  }
}
