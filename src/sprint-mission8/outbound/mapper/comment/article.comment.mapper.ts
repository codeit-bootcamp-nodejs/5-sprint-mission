import { ArticleComment } from "@prisma/client";
import { NewArticleCommentEntity, PersitstArticleCommentEntity, ArticleCommentEntity } from "../../../domain/entity/comment/article-comment.entity";

export type CreateCommentData = {
  articleId: string;
  userId: string;
  content: string;
}
export type UpdateCommentData = {
  content: string;
}

export class ArticleCommentMapper {
  static toCreateData(entity: NewArticleCommentEntity): CreateCommentData {
    return {
      articleId: entity.articleId,
      userId: entity.userId,
      content: entity.content,
    }
  }

  static toUpdateData(entity: PersitstArticleCommentEntity): UpdateCommentData {
    return {
      content: entity.content,
    }
  }

  static toPersistEntity(entity: ArticleComment) {
    return ArticleCommentEntity.createPersist({
      id: entity.id,
      articleId: entity.articleId,
      userId: entity.userId,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
}
