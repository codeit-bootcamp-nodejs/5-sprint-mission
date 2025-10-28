import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const articleRepository = {
  findMine: (userId: number) =>
    prisma.article.findMany({
      where: { userId },
      select: { id: true, title: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  list: (
    where: Prisma.ArticleWhereInput,
    orderBy: any[],
    skip: number,
    take: number,
  ) =>
    prisma.$transaction([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take,
        select: { id: true, title: true, content: true, createdAt: true },
      }),
      prisma.article.count({ where }),
    ]),
  findById: (id: number) => prisma.article.findUnique({ where: { id } }),
  create: (data: any) => prisma.article.create({ data }),
  update: (id: number, data: any) =>
    prisma.article.update({ where: { id }, data }),
  delete: (id: number) => prisma.article.delete({ where: { id } }),
  likeUpsert: (userId: number, articleId: number) =>
    prisma.likeArticle.upsert({
      where: { userId_articleId: { userId, articleId } },
      create: { userId, articleId },
      update: {},
    }),
  likeDelete: (userId: number, articleId: number) =>
    prisma.likeArticle
      .delete({
        where: { userId_articleId: { userId, articleId } },
      })
      .catch(() => null),
  likesOfUserFor: (userId: number, articleIds: number[]) =>
    prisma.likeArticle.findMany({
      where: { userId, articleId: { in: articleIds } },
      select: { articleId: true },
    }),
};
