import { Prisma, PrismaClient } from "@prisma/client";
import { IArticleRepository } from "../domain/port/article-repository-interface";
import { BaseRepository } from "./base-repository";
import { UploadArticleDto } from "../dto/article/upload-article.dto";
import { ArticleMapper } from "./mapper/article-mapper";
import { EditArticleDto } from "../dto/article/edit-article.dto";
import { PaginationQuery } from "./repository";
import { FavoriteArticleWithLike } from "../domain/entity/article-entity";

export class ArticleRepository extends BaseRepository implements IArticleRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  upload = async (articleData: UploadArticleDto & { userId: number }) => {
    const uploadedArticle = await this.prisma.article.create({
      data: articleData,
    });
    return ArticleMapper.toEntity(uploadedArticle);;
  };

  loadDetail = async (articleId: number) => {
    const articleDetail = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!articleDetail) return null;

    return ArticleMapper.toEntity(articleDetail)
  };

  edit = async (articleId: number, articleData: EditArticleDto) => {
    const editedArticle = await this.prisma.article.update({
      where: { id: articleId },
      data: articleData,
    });
    return ArticleMapper.toEntity(editedArticle);
  }

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
    return articles.map(ArticleMapper.toEntity);
  };

  loadUserArticles = async (
    userId: number,
    query: PaginationQuery,
  ) => {
    const { offset = 0, limit = 10 } = query;

    const articles = await this.prisma.article.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    })

    return articles.map(ArticleMapper.toEntity);
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

    return likeRecords.map((record) => {
      const articleEntity = ArticleMapper.toEntity(record.article);
      return {
        ...articleEntity,
        likedAt: record.createdAt,
      };
    }) as FavoriteArticleWithLike[]
  }
}
