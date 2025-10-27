export class GetArticleResDto {
  constructor(getArticle) {
    this.id = getArticle.id;
    this.title = getArticle.title;
    this.content = getArticle.content;
    this.createdAt = getArticle.createdAt;
    this.updatedAt = getArticle.updatedAt;
  }
}
