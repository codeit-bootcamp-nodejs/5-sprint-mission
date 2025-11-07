import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const articleRepository = {
  findMine(userId: number) {
    return prisma.article.findMany({
      where: { userId },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  },

  list(
    where: Prisma.ArticleWhereInput,
    orderBy: Prisma.ArticleOrderByWithRelationInput[],
    skip: number,
    take: number,
  ) {
    return prisma.article.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  },

  findById(id: number) {
    return prisma.article.findUnique({ where: { id } });
  },

  create(data: Prisma.ArticleUncheckedCreateInput) {
    return prisma.article.create({ data });
  },

  update(id: number, data: Prisma.ArticleUpdateInput) {
    return prisma.article.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.article.delete({ where: { id } });
  },

  likeUpsert(userId: number, articleId: number) {
    return prisma.likeArticle.upsert({
      where: { userId_articleId: { userId, articleId } },
      create: { userId, articleId },
      update: {},
    });
  },

  likeDelete(userId: number, articleId: number) {
    return prisma.likeArticle
      .delete({
        where: { userId_articleId: { userId, articleId } },
      })
      .catch(() => null);
  },

  likesOfUserFor(userId: number, articleIds: number[]) {
    return prisma.likeArticle.findMany({
      where: { userId, articleId: { in: articleIds } },
      select: { articleId: true },
    });
  },
};
