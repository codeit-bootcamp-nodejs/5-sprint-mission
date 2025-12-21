import { ArticleComment } from "../../02-application/command/entity/article.comment";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";
import { PersistArticleComment } from "../repository/command/article.comment.command.repository";

export const ArticleCommentMapper = {
  toPersist: (entity: PersistArticleComment | null) => {
    if (!entity) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }
    return ArticleComment.createPersisted({
      id: entity.id,
      articleId: entity.articleId,
      content: entity.content,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  },
};
