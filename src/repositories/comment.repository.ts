import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const commentRepository = {
  findById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  },

  findByIds(ids: number[]) {
    return prisma.comment.findMany({ where: { id: { in: ids } } });
  },

  listByProduct(
    productId: number,
    skip = 0,
    take = 20,
    orderBy: Prisma.CommentOrderByWithRelationInput[] = [{ createdAt: "desc" }]
  ) {
    return prisma.comment.findMany({
      where: { productId },
      orderBy,
      skip,
      take,
      include: {
        user: { select: { id: true, nickname: true, image: true } },
      },
    });
  },

  listByArticle(
    articleId: number,
    skip = 0,
    take = 20,
    orderBy: Prisma.CommentOrderByWithRelationInput[] = [{ createdAt: "desc" }]
  ) {
    return prisma.comment.findMany({
      where: { articleId },
      orderBy,
      skip,
      take,
      include: {
        user: { select: { id: true, nickname: true, image: true } },
      },
    });
  },

  createForProduct(data: { userId: number; productId: number; content: string }) {
    const payload: Prisma.CommentUncheckedCreateInput = {
      userId: data.userId,
      productId: data.productId,
      content: data.content,
    };
    return prisma.comment.create({ data: payload });
  },

  createForArticle(data: { userId: number; articleId: number; content: string }) {
    const payload: Prisma.CommentUncheckedCreateInput = {
      userId: data.userId,
      articleId: data.articleId,
      content: data.content,
    };
    return prisma.comment.create({ data: payload });
  },

  update(id: number, data: { content: string }) {
    const payload: Prisma.CommentUpdateInput = { content: data.content };
    return prisma.comment.update({ where: { id }, data: payload });
  },

  remove(id: number) {
    return prisma.comment.delete({ where: { id } });
  },
};
