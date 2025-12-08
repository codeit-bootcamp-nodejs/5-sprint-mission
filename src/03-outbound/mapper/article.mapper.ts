import { Article } from "../../02-domain/entity/article";
import { PersistArticle } from "../repo/article.repository";

export class ArticleMapper { 
    static toPersist(entity: PersistArticle) {
        return Article.createPersist({
            id: entity.id,
            title: entity.title,
            content: entity.content,
            userId: entity.userId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }
}