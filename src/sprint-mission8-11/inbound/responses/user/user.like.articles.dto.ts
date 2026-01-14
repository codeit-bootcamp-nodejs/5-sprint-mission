import { PersistArticleEntity } from "../../../application/command/entity/article.entity";

export class UserLikeArticlesResDto {
  public articles;

  constructor(likeArticles: PersistArticleEntity[]) {
    this.articles = likeArticles.map((article) => ({
      ownerId: article.userId,
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    }));
  }
}
