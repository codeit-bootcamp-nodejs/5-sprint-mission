import { Article } from "@prisma/client";
import { ArticleEntity, PersistedArticleEntity } from "../../domain/entity/article-entity";

export class ArticleMapper {
  static toPersistent(entity: ArticleEntity) {
    return {
      title: entity.title,
      content: entity.content,
      images: entity.images,
      userId: entity.userId
    } 
  }
  static toEntity(article: Article ) {
    return new ArticleEntity({
      id: article.id,
      title: article.title,
      content: article.content,
      images: article.images ?? undefined,
      userId: article.userId,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }) as PersistedArticleEntity;
  }
}