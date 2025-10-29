export class CommentService {
  #prisma;
  constructor(prisma) { this.#prisma = prisma; }

  async createProductComment(userId, productId, content) {
    return this.#prisma.productComment.create({
      data: { userId, productId, content },
    });
  }

  async createArticleComment(userId, articleId, content) {
    return this.#prisma.articleComment.create({
      data: { userId, articleId, content },
    });
  }

  async updateComment(userId, commentId, content) {
    const comment = await this.#prisma.productComment.findUnique({ where: { id: commentId } }) ||
                    await this.#prisma.articleComment.findUnique({ where: { id: commentId } });
    if (!comment || comment.userId !== userId) throw new Error("Forbidden");
    return await this.#prisma.comment.update({
      where: { id: commentId },
      data: { content, updatedAt: new Date() },
    });
  }

  async deleteComment(userId, commentId) {
    const comment = await this.#prisma.productComment.findUnique({ where: { id: commentId } }) ||
                    await this.#prisma.articleComment.findUnique({ where: { id: commentId } });
    if (!comment || comment.userId !== userId) throw new Error("Forbidden");
    return await this.#prisma.comment.delete({ where: { id: commentId } });
  }
}
