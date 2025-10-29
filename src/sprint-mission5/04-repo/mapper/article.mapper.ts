import { Article, ArticleLike } from "@prisma/client";
import { ArticleEntity } from "../../03-domain/entity/article.entity";

interface ArticleWithLike extends Article {
  ArticleLike?: ArticleLike[];
}

export class ArticleMapper {
  static toEntity(article: ArticleWithLike) {
    return new ArticleEntity({
      id: article.id,
      userId: article.userId,
      title: article.title,
      content: article.content,
      isLiked: !!article.ArticleLike?.length,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    });
  }
  static toPersistent(entity: ArticleEntity) {
    return {
      userId: entity.userId,
      title: entity.title,
      content: entity.content,
    };
  }
}
