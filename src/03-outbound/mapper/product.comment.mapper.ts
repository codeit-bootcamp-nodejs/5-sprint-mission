import {
  PersistedProductComment,
  ProductComment,
} from "../../02-domain/entity/product.comment.entity";
import { PersistProductComment } from "../repository/product.comment.repository";

export const ProductCommentMapper = {
  toPersist: (record: PersistProductComment): PersistedProductComment => {
    return ProductComment.createPersist({
      id: record.id,
      productId: record.productId,
      content: record.content,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      userId: record.userId,
    }) as PersistedProductComment;
  },
};
