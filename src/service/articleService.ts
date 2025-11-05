import type { PrismaClient } from "@prisma/client";
import { CreateArticleDTO } from "../common/dto";

export class ArticleService {
  #prisma: PrismaClient;
  constructor(prisma: PrismaClient) { this.#prisma = prisma; }

  async createArticle(userId: string, data: CreateArticleDTO) {
    return this.#prisma.article.create({
      data: { ...data, userId },
      include: { likes: true, comments: true }
    });
  }

  async getArticles(userId: string | null) {
    const items = await this.#prisma.article.findMany({
      include: { likes: true, comments: true },
      orderBy: { createdAt: "desc" }
    });

    return items.map(a => ({
      ...a,
      isLiked: !!(userId && a.likes.some(l => l.userId === userId && l.isLiked)),
    }));
  }

  async toggleLike(userId: string, articleId: string) {
    const like = await this.#prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } }
    });

    if (like) {
      return this.#prisma.articleLike.update({
        where: { userId_articleId: { userId, articleId } },
        data: { isLiked: !like.isLiked }
      });
    }

    return this.#prisma.articleLike.create({
      data: { userId, articleId }
    });
  }
}
