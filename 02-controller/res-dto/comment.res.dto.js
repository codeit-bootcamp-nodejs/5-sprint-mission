export class CommentResDto {

    id
    content
    createdAt
    updatedAt
    articleId
    productId


    constructor({ id, content, createdAt, updatedAt, articeId = "", productId = "" }) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.articleId = articeId;
        this.productId = productId;
    }
}