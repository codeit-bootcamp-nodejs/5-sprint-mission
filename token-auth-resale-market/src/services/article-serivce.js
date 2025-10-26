import { ArticleRepository } from "../repositories/article-repository.js";

export class ArticleService {
  constructor(prisma) {
    this.articleRepository = new ArticleRepository(prisma);
  }

  async createArticle(articleData) {
    if (!articleData.title || !articleData.content) {
      throw new Error("제목과 내용을 모두 입력해야 합니다.");
    }

    const article = await this.articleRepository.post(articleData);
    return article;
  }

  async getArticles(query) {
    const articles = await this.articleRepository.loadList(query);
    return articles;
  }

  async getArticleById(articleId) {
    const article = await this.articleRepository.loadDetail(articleId);
    if (!article) throw new Error("존재하지 않는 게시글입니다.");
    return article;
  }

  async updateArticle(articleId, articleData) {
    const existing = await this.articleRepository.loadDetail(articleId);
    if (!existing) throw new Error("존재하지 않는 게시글입니다.");

    const updated = await this.articleRepository.edit(articleId, articleData);
    return updated;
  }

  async deleteArticle(articleId) {
    const existing = await this.articleRepository.loadDetail(articleId);
    if (!existing) throw new Error("존재하지 않는 게시글입니다.");

    await this.articleRepository.delete(articleId);
    return true;
  }
}
