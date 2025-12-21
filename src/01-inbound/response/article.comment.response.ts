import { PersistedArticleComment } from "../../02-domain/entity/article.comment";

export const ArticleCommentResDto = (entity: PersistedArticleComment) => {
  const { id, articleId, content, createdAt, updatedAt, userId } = entity;

  return {
    id,
    articleId,
    content,
    createdAt,
    updatedAt,
    userId,
  };
};
