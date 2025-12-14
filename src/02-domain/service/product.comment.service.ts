import { Authenticator } from "../../external/authenticator";
import { IBaseRepository } from "../port/I.base.repository";
import { ProductComment } from "../entity/product.comment.entity";
import { ProductCommentResDto } from "../../01-inbound/response/product.comment.response";
import { ProductCommentDto } from "../../01-inbound/request/product.comment.request";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";

export const createProductCommentService = (repos: IBaseRepository) => {
  const createProductComment = async (dto: ProductCommentDto) => {
    const { content, productId, userId } = dto;
    const productCommentEntity = ProductComment.createNew({
      productId,
      content,
      userId,
    });
    const productComment =
      await repos.productComment.save(productCommentEntity);
    return ProductCommentResDto(productComment);
  };

  const getProductComments = async (productId: string) => {
    const productComments = await repos.productComment.findAll(productId);
    return productComments.map((productComment) => {
      return ProductCommentResDto(productComment);
    });
  };

  const updateProductComment = async (dto: ProductCommentDto) => {
    const { content, productId, commentId, userId } = dto;
    if (!commentId) {
      throw BusinessException({
        type: BusinessExceptionType.WRONG_URL,
      });
    }

    // 기존 댓글 조회
    const foundProductComment = await repos.productComment.findById(commentId);
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
    const productCommentEntity = await repos.productComment.update(
      foundProductComment,
      productComment,
    );
    return ProductCommentResDto(productCommentEntity);
  };

  const deleteProductComments = async (commentId: string) => {
    await repos.productComment.remove(commentId);
  };

  return {
    createProductComment,
    getProductComments,
    updateProductComment,
    deleteProductComments,
  };
};

export type ProductCommentServiceType = ReturnType<
  typeof createProductCommentService
>;
