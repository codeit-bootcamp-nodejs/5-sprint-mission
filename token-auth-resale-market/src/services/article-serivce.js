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
  async likeArticle(articleId, userId) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) throw new Exception(404, "존재하지 않는 게시글입니다");
    const exists = await this.prisma.articleLike.findUnique({
      where: { articleId_userId: { articleId, userId } },
    });
    if (exists) throw new Exception(409, "이미 좋아요한 게시글입니다");
    await this.prisma.articleLike.create({ data: { articleId, userId } });
    return { liked: true };
  }

  async unlikeArticle(articleId, userId) {
    const exists = await this.prisma.articleLike.findUnique({
      where: { articleId_userId: { articleId, userId } },
    });
    if (!exists) throw new Exception(404, "좋아요한 내역이 없습니다");
    await this.prisma.articleLike.delete({
      where: { articleId_userId: { articleId, userId } },
    });
    return { liked: false };
  }
}
