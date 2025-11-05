import type { PrismaClient } from "@prisma/client";

export class CommentService {
  #prisma: PrismaClient;
  constructor(prisma: PrismaClient) { this.#prisma = prisma; }

  async createProductComment(userId: string, productId: string, content: string) {
    return this.#prisma.productComment.create({
      data: { userId, productId, content },
    });
  }

  async createArticleComment(userId: string, articleId: string, content: string) {
    return this.#prisma.articleComment.create({
      data: { userId, articleId, content },
    });
  }

  async updateComment(userId: string, commentId: string, content: string) {
    // 먼저 productComment에서 찾기
    const productComment = await this.#prisma.productComment.findUnique({ where: { id: commentId } });
    if (productComment) {
      if (productComment.userId !== userId) throw new Error("Forbidden");
      return this.#prisma.productComment.update({
        where: { id: commentId },
        data: { content, updatedAt: new Date() }
      });
    }

    const articleComment = await this.#prisma.articleComment.findUnique({ where: { id: commentId } });
    if (articleComment) {
      if (articleComment.userId !== userId) throw new Error("Forbidden");
      return this.#prisma.articleComment.update({
        where: { id: commentId },
        data: { content, updatedAt: new Date() }
      });
    }

    throw new Error("Comment not found");
  }

  async deleteComment(userId: string, commentId: string) {
    const productComment = await this.#prisma.productComment.findUnique({ where: { id: commentId } });
    if (productComment) {
      if (productComment.userId !== userId) throw new Error("Forbidden");
      return this.#prisma.productComment.delete({ where: { id: commentId } });
    }

    const articleComment = await this.#prisma.articleComment.findUnique({ where: { id: commentId } });
    if (articleComment) {
      if (articleComment.userId !== userId) throw new Error("Forbidden");
      return this.#prisma.articleComment.delete({ where: { id: commentId } });
    }

    throw new Error("Comment not found");
  }
}
