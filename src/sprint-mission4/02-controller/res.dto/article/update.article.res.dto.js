export class UpdateArticleResDto {
  constructor(updateArticle) {
    this.id = updateArticle.id;
    this.title = updateArticle.title;
    this.content = updateArticle.content;
    this.createdAt = updateArticle.createdAt;
    this.updatedAt = updateArticle.updatedAt;
  }
}
