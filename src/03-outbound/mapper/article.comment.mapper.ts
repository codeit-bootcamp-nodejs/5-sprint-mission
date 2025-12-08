import { ArticleComment } from "../../02-domain/entity/article.comment.entity";
import { PersistArticleComment } from "../repo/article.comment.repository";

export class ArticleCommentMapper { 
    static toPersist(entity: PersistArticleComment) {
        return ArticleComment.createPersisted({
            id: entity.id,
            articleId: entity.articleId,
            content: entity.content,
            userId: entity.userId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }
}