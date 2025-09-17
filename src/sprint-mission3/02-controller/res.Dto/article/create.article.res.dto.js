export class CreateArticleResDto {
  constructor(createArticle) {
    this.id = createArticle.id;
    this.title = createArticle.title;
    this.content = createArticle.content;
    this.createdAt = createArticle.createdAt;
    this.updatedAt = createArticle.updatedAt;
  }
}
