import { PersistedProductComment } from "../../03-domain/entity/product.comment.entity"



export class ProductCommentResDto {
    id
    productId
    content
    createdAt
    updatedAt
    userId


    constructor(record: PersistedProductComment) {
        const { id, productId, content, createdAt, updatedAt, userId } = record;

        this.id = id;
        this.productId = productId;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;

    }
}