import { ProductCommentDto } from "../../../01-inbound/request/product.comment.request";
import { ProductCommentResDto } from "../../../01-inbound/response/product.comment.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { IProductCommentCommandRepository } from "../../port/repositories/command/I.product.comment.repository";
import { ProductComment } from "../entity/product.comment.entity";



export const createProductCommentCommandService = (
  productCommentCommandRepository: IProductCommentCommandRepository,
  notificationEventBuses: INotificationEventBus
) => {
  const createProductComment = async (dto: ProductCommentDto) => {
    const { content, productId, userId } = dto;
    const productCommentEntity = ProductComment.createNew({
      productId,
      content,
      userId,
    });
    const productComment =
      await productCommentCommandRepository.save(productCommentEntity);
    return ProductCommentResDto(productComment);
  };


  const updateProductComment = async (dto: ProductCommentDto) => {
    const { content, productId, commentId, userId } = dto;
    if (!commentId) {
      throw BusinessException({
        type: BusinessExceptionType.WRONG_URL,
      });
    }

    // 기존 댓글 조회
    const foundProductComment = await productCommentCommandRepository.findById(commentId);
    if (!foundProductComment) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }
    if (foundProductComment.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    // 댓글 수정
    const productComment = ProductComment.createNew({
      productId,
      content,
      userId,
    });
    const productCommentEntity = await productCommentCommandRepository.update(
      foundProductComment,
      productComment,
    );
    return ProductCommentResDto(productCommentEntity);
  };

  const deleteProductComments = async (commentId: string) => {
    await productCommentCommandRepository.remove(commentId);
  };

  return {
    createProductComment,
    updateProductComment,
    deleteProductComments,
  };
};

export type ProductCommentCommandServiceType = ReturnType<
  typeof createProductCommentCommandService
>;
