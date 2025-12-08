import { PersistedProduct, Product } from "../../02-domain/entity/product";
import { PersistedProductComment, ProductComment } from "../../02-domain/entity/product.comment.entity";
import { PersistProductComment } from "../repo/product.comment.repository";
import { PersistProduct } from "../repo/product.repository";

export class ProductCommentMapper {
    static toPersist(record: PersistProductComment): PersistedProductComment {
        return ProductComment.createPersist({
            id: record.id,
            productId: record.productId,
            content: record.content,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            userId: record.userId
        }) as PersistedProductComment;
    }
}