import { ArticleEntity } from "../../domain/entity/article-entity";

export const mapArticle = (article: ArticleEntity) => ({
  id: article.id,
  userId: article.userId,
  title: article.title,
  content: article.content,
  image: article.image,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
});
