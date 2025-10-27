import { Article } from "../../03-domain/entity/article.js";

export class ArticleMapper {
  static toEntity(record) {
    return new Article({
      id: record.id,
      userId: record.userId,
      title: record.title,
      content: record.content,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  static toEntityLike(record) {
    return new Article({
      id: record.article.id,
      userId: record.article.userId,
      title: record.article.title,
      content: record.article.content,
      isLiked: record.isLiked,
      createdAt: record.article.createdAt,
      updatedAt: record.article.updatedAt,
    });
  }
  static toPersistent(entity) {
    return {
      userId: entity.userId,
      title: entity.title,
      content: entity.content,
    };
  }
}
