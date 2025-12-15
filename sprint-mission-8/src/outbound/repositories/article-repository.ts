import { Prisma, PrismaClient } from "@prisma/client";
import { IArticleRepository } from "../../domain/port/repository/article-repository";
import { BaseRepository } from "./base-repository";
import { PaginationQuery } from "../repository";
import {
  ArticleEntity,
  EditArticleAttrs,
  NewArticleAttrs,
} from "../../domain/entity/article-entity";

export class ArticleRepository
  extends BaseRepository
  implements IArticleRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  upload = async (articleData: NewArticleAttrs & { userId: number }) => {
    const uploadedArticle = await this.prisma.article.create({
      data: articleData,
    });
    return ArticleEntity.fromPersisted(uploadedArticle);
  };

  loadDetail = async (articleId: number) => {
    const articleDetail = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!articleDetail) return null;

    return ArticleEntity.fromPersisted(articleDetail);
  };

  edit = async (articleId: number, articleData: EditArticleAttrs) => {
    const editedArticle = await this.prisma.article.update({
      where: { id: articleId },
      data: articleData,
    });
    return ArticleEntity.fromPersisted(editedArticle);
  };

  delete = async (articleId: number) => {
    await this.prisma.article.delete({
      where: { id: articleId },
    });
    return;
  };

  loadList = async (query: PaginationQuery) => {
    const { offset = 0, limit = 10, search = "" } = query;
    const condition = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const articles = await this.prisma.article.findMany({
      where: condition as Prisma.ArticleWhereInput,
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: offset,
      take: limit,
    });
    return articles.map(ArticleEntity.fromPersisted);
  };

  loadUserArticles = async (userId: number, query: PaginationQuery) => {
    const { offset = 0, limit = 10 } = query;

    const articles = await this.prisma.article.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    return articles.map(ArticleEntity.fromPersisted);
  };

  findArticleLike = async (articleId: number, userId: number) => {
    return this.prisma.like.findUnique({
      where: {
        articleId_userId: {
          articleId: articleId,
          userId: userId,
        },
      },
    });
  };

  createArticleLike = async (articleId: number, userId: number) => {
    return this.prisma.like.create({
      data: {
        articleId: articleId,
        userId: userId,
      },
    });
  };

  deleteArticleLike = async (articleId: number, userId: number) => {
    return this.prisma.like.delete({
      where: {
        articleId_userId: {
          articleId: articleId,
          userId: userId,
        },
      },
    });
  };

  findFavoriteArticlesByUserId = async (
    userId: number,
    query: PaginationQuery,
  ) => {
    const { offset = 0, limit = 10 } = query;

    const likeRecords = await this.prisma.like.findMany({
      where: { userId },
      select: {
        article: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    return likeRecords.map((record) =>
      ArticleEntity.fromPersisted(record.article),
    );
  };
}
