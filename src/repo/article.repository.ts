import prisma from "../prisma.client";
import { Prisma } from "@prisma/client";
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleListQueryDto,
} from "../dto/article.dto";

export class ArticleRepository {
  async createArticle(authorId: number, data: CreateArticleDto) {
    return prisma.article.create({
      data: {
        authorId,
        title: data.title,
        content: data.content,
      },
    });
  }

  async findArticles(query: ArticleListQueryDto, userId?: number) {
    const { offset, limit, keyword, sort } = query;

    const queryMode: Prisma.QueryMode = "insensitive";

    const whereCondition: Prisma.ArticleWhereInput = {
      OR: [
        { title: { contains: keyword, mode: queryMode } },
        { content: { contains: keyword, mode: queryMode } },
      ],
    };

    return prisma.article.findMany({
      skip: offset,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: { nickname: true },
        },
        _count: {
          select: { likes: true },
        },
        likes: userId
          ? {
              where: { userId: userId },
              select: { id: true },
            }
          : false,
      },
    });
  }

  async findArticleById(id: number, userId?: number) {
    return prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: { nickname: true },
        },
        _count: {
          select: { likes: true },
        },
        likes: userId
          ? {
              where: { userId: userId },
              select: { id: true },
            }
          : false,
      },
    });
  }

  async findArticleByIdSimple(id: number) {
    return prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
  }

  async updateArticle(id: number, data: UpdateArticleDto) {
    return prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
      },
    });
  }

  async deleteArticle(id: number) {
    return prisma.article.delete({
      where: { id },
    });
  }

  async findArticleLike(userId: number, articleId: number) {
    return prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          userId: userId,
          articleId: articleId,
        },
      },
    });
  }

  async createArticleLike(userId: number, articleId: number) {
    return prisma.articleLike.create({
      data: {
        userId: userId,
        articleId: articleId,
      },
    });
  }

  async deleteArticleLike(id: number) {
    return prisma.articleLike.delete({
      where: { id },
    });
  }

  async countArticleLikes(articleId: number) {
    return prisma.articleLike.count({
      where: { articleId },
    });
  }
}
