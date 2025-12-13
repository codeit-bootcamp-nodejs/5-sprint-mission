import { PersistedProductComment } from "../../02-domain/entity/product.comment.entity"



export class ProductCommentResDto {
    id
    productId
    content
    createdAt
    updatedAt
    userId


    constructor(entity: PersistedProductComment) {
        const { id, productId, content, createdAt, updatedAt, userId } = entity;

        this.id = id;
        this.productId = productId;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;

    }
}