import { Article } from "@prisma/client";
import { ArticleEntity, NewArticleEntity, PersistArticleEntity } from "../../domain/entity/article.entity";

export type CreateArticleData = {
  userId: string;
  title: string;
  content: string;
  image?: string;
};

export type UpdateArticleData = {
  title: string;
  content: string;
  image?: string;
};

export class ArticleMapper {
  static toCreateData(entity: NewArticleEntity): CreateArticleData {
    return {
      userId: entity.userId,
      title: entity.title,
      content: entity.content,
      image: entity.image
    };
  }

  static toUpdateData(entity: PersistArticleEntity): UpdateArticleData {
    return {
      title: entity.title,
      content: entity.content,
      image: entity.image
    };
  }

  static toPersistEntity(entity: Article): PersistArticleEntity {
    return ArticleEntity.createPersist({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

}
