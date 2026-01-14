import { PersistedProductComment } from "../../02-application/command/entity/product.comment.entity";

export const ProductCommentResDto = (entity: PersistedProductComment) => {
  const { id, productId, content, createdAt, updatedAt, userId } = entity;

  return {
    id,
    productId,
    content,
    createdAt,
    updatedAt,
    userId,
  };
};
