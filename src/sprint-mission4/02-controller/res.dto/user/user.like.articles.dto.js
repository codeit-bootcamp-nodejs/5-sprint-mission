export class UserLikeArticlesResDto {
  articles;
  constructor(likeArticles) {
    this.articles = likeArticles.map((article) => ({
      ownerId: article.userId,
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      isLiked: article.isLiked,
    }));
  }
}
