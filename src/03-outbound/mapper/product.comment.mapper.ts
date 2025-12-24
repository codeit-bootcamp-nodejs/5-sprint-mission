
import { PersistedProductComment, ProductComment } from "../../02-application/command/entity/product.comment.entity";
import { PersistProductComment } from "../repository/command/product.comment.command.repository";

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
