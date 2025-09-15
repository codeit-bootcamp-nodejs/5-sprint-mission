import { Article } from "../../03-domain/entity/article.js";

export class ArticleMapper {
  static toEntity(record) {
    return new Article({
      id: record.id,
      title: record.title,
      content: record.content,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }
  static toPersistent(entity) {
    return {
      title: entity.title,
      content: entity.content,
    }
  }
}