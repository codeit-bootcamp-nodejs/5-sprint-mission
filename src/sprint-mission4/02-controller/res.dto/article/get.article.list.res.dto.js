export class GetArticleListResDto {
  constructor(ArticleList) {
    this.ArticleList = ArticleList.map((Article) => ({
      id: Article.id,
      title: Article.title,
      content: Article.content,
      createdAt: Article.createdAt,
      updatedAt: Article.updatedAt,
    }));
  }
}
