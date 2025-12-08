import { PersistedArticleComment } from "../../02-domain/entity/article.comment.entity"
import { PersistedProductComment } from "../../02-domain/entity/product.comment.entity"



export class ArticleCommentResDto {
    id
    articleId
    content
    createdAt
    updatedAt
    userId


    constructor(record: PersistedArticleComment) {
        const { id, articleId, content, createdAt, updatedAt, userId } = record;

        this.id = id;
        this.articleId = articleId;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;

    }
}