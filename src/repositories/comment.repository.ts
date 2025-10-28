import { prisma } from "../lib/prisma";

export const commentRepository = {
  listByProduct: (productId: number, cursor?: number, limit: number = 10) =>
    prisma.comment.findMany({
      where: { productId },
      orderBy: { id: "desc" },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: { id: true, content: true, createdAt: true, userId: true },
    }),
  listByArticle: (articleId: number, cursor?: number, limit: number = 10) =>
    prisma.comment.findMany({
      where: { articleId },
      orderBy: { id: "desc" },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: { id: true, content: true, createdAt: true, userId: true },
    }),
  createForProduct: (data: {
    content: string;
    userId: number;
    productId: number;
  }) => prisma.comment.create({ data }),
  createForArticle: (data: {
    content: string;
    userId: number;
    articleId: number;
  }) => prisma.comment.create({ data }),
  findById: (id: number) => prisma.comment.findUnique({ where: { id } }),
  update: (id: number, data: { content: string }) =>
    prisma.comment.update({ where: { id }, data }),
  delete: (id: number) => prisma.comment.delete({ where: { id } }),
};
