export class ArticleLikeResDto {
  constructor(getArticle) {
    this.ownerId = getArticle.userId;
    this.id = getArticle.id;
    this.title = getArticle.title;
    this.content = getArticle.content;
    this.isLiked = getArticle.isLiked;
    this.createdAt = getArticle.createdAt;
    this.updatedAt = getArticle.updatedAt;
  }
}
