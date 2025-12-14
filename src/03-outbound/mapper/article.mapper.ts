import { Article } from "../../02-domain/entity/article";
import { PersistArticle } from "../repository/article.repository";

export const ArticleMapper = {
  toPersist: (entity: PersistArticle) => {
    return Article.createPersist({
      id: entity.id,
      title: entity.title,
      content: entity.content,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  },
};
