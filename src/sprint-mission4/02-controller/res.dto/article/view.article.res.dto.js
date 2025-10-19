export class ViewArticleResDto {
  constructor(viewArticle) {
    this.id = viewArticle.id;
    this.title = viewArticle.title;
    this.content = viewArticle.content;
    this.createdAt = viewArticle.createdAt;
    this.updatedAt = viewArticle.updatedAt;
  }
}
