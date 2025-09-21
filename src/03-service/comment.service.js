import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class CommentService {
  badRequest(message = 'Bad Request') {
    const e = new Error(message);
    e.status = 400;
    throw e;
  }

  notFound(message = 'Resource not found') {
    const e = new Error(message);
    e.status = 404;
    throw e;
  }

  async createForProduct(productId, content) {
    const exists = await prisma.product.findUnique({
      where: { id: Number(productId) },
      select: { id: true },
    });
    if (!exists) this.notFound('Product not found');

    return prisma.comment.create({
      data: { content, productId: Number(productId) },
      select: { id: true, content: true, createdAt: true },
    });
  }

  async createForArticle(articleId, content) {
    const exists = await prisma.article.findUnique({
      where: { id: Number(articleId) },
      select: { id: true },
    });
    if (!exists) this.notFound('Article not found');

    return prisma.comment.create({
      data: { content, articleId: Number(articleId) },
      select: { id: true, content: true, createdAt: true },
    });
  }

  async update(id, content) {
    if (!content) this.badRequest('Missing content');
    try {
      return await prisma.comment.update({
        where: { id: Number(id) },
        data: { content },
        select: { id: true, content: true, createdAt: true },
      });
    } catch {
      this.notFound('Comment not found');
    }
  }

  async delete(id) {
    try {
      await prisma.comment.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      this.notFound('Comment not found');
    }
  }

  async listForProduct(productId, { limit, cursor }) {
    const args = {
      where: { productId: Number(productId) },
      take: limit,
      orderBy: { id: 'asc' },
      select: { id: true, content: true, createdAt: true },
    };
    if (cursor) {
      args.cursor = { id: Number(cursor) };
      args.skip = 1;
    }

    const items = await prisma.comment.findMany(args);
    const nextCursor = items.length === limit ? items[items.length - 1].id : null;
    return { items, nextCursor };
  }

  async listForArticle(articleId, { limit, cursor }) {
    const args = {
      where: { articleId: Number(articleId) },
      take: limit,
      orderBy: { id: 'asc' },
      select: { id: true, content: true, createdAt: true },
    };
    if (cursor) {
      args.cursor = { id: Number(cursor) };
      args.skip = 1;
    }

    const items = await prisma.comment.findMany(args);
    const nextCursor = items.length === limit ? items[items.length - 1].id : null;
    return { items, nextCursor };
  }
}
