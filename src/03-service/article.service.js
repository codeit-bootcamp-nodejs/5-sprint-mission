import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ArticleService {
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

  create(data) {
    return prisma.article.create({
      data,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }


  async getById(id) {
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!article) this.notFound('Article not found');
    return article;
  }


  async update(id, data) {
    if (!Object.keys(data || {}).length) this.badRequest('Nothing to update');
    try {
      return await prisma.article.update({
        where: { id: Number(id) },
        data,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch {
      this.notFound('Article not found');
    }
  }


  async delete(id) {
    try {
      await prisma.article.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      this.notFound('Article not found');
    }
  }

  async list({ skip, take, search, sort }) {
    const where = search
      ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }
      : undefined;

    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { id: 'asc' };

    const [items, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    return { items, total };
  }
}
