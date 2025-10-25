export class CommentResDto {

    id
    content
    createdAt
    updatedAt
    articleId
    productId
    userId


    constructor({ id, content, createdAt, updatedAt, articleId, productId, userId}) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.articleId = articleId;
        this.productId = productId; 
        this.userId = userId;
    }
}