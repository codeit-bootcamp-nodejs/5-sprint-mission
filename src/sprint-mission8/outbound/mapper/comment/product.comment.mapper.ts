import { ProductComment } from "@prisma/client";
import { NewProductCommentEntity, PersitstProductCommentEntity, ProductCommentEntity } from "../../../domain/entity/comment/product-comment.entity";

export type CreateCommentData = {
  productId: string;
  userId: string;
  content: string;
}
export type UpdateCommentData = {
  content: string;
}

export class ProductCommentMapper {
  static toCreateData(entity: NewProductCommentEntity): CreateCommentData {
    return {
      productId: entity.productId,
      userId: entity.userId,
      content: entity.content,
    }
  }

  static toUpdateData(entity: PersitstProductCommentEntity): UpdateCommentData {
    return {
      content: entity.content,
    }
  }

  static toPersistEntity(entity: ProductComment) {
    return ProductCommentEntity.createPersist({
      id: entity.id,
      productId: entity.productId,
      userId: entity.userId,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
}
