import { PersistedArticle } from "../../02-application/command/entity/article";

export const ArticleResDto = (entity: PersistedArticle) => {
  const { id, title, content, createdAt, updatedAt, userId } = entity;

  return {
    id,
    title,
    content,
    createdAt,
    updatedAt,
    userId,
  };
};
