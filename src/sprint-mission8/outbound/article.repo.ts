import { Article, PrismaClient } from "@prisma/client";
import { BaseRepo } from "./base.repo";
import { ArticleEntity, PersistedArticleEntity } from "../domain/entity/article.entity";
import { ArticleMapper } from "./mapper/article.mapper";
import { ArticleKeys, QueryType } from "../types/query";
import { IArticleRepo } from "../domain/port/repo/i.article.repo";

export type ArticleQuery = QueryType<ArticleKeys>;

export class ArticleRepo extends BaseRepo implements IArticleRepo {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  findArticleByTitle = async (title: string) => {
    const article = await this._prisma.article.findUnique({
      where: { title },
    });
    if (!article) return null;

    return article ? ArticleMapper.toEntity(article) : null;
  };

  findArticleById = async (id: string) => {
    const article = await this._prisma.article.findUnique({
      where: { id },
    });
    return article ? ArticleMapper.toEntity(article) : null;
  };

  findArticleLike = async (userId: string, articleId: string) => {
    const article = await this._prisma.article.findUnique({
      where: {
        id: articleId
      },
      include: {
        ArticleLike: userId ? { // 비로그인자도 isliked false로 주기
          where: {
            userId
          }
        } : false
      },
    });

    if (!article || article.ArticleLike.length === 0) {
      return null; 
    }

    return ArticleMapper.toEntity(article);
  };

  findArticleList = async ({ offset, limit, orderBy }: ArticleQuery) => {
    const articleList = await this._prisma.article.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort
      },
    });

    return articleList.map((article) => ArticleMapper.toEntity(article));
  };

  create = async (entity: PersistedArticleEntity) => {
    const article = await this._prisma.article.create({
      data: {
        ...ArticleMapper.toPersistentForCreate(entity),
      },
    });
    return ArticleMapper.toEntity(article);
  };

  addArticleLike = async (userId: string, articleId: string) => {
    const createArticleLike = await this._prisma.articleLike.create({
      data: {
        userId,
        articleId,
        isLiked: true,
      },
      include: {
        article: true,
      },
    });

    const articleWithLike = {
      ...createArticleLike.article,
      ArticleLike: [createArticleLike],
    }

    return ArticleMapper.toEntity(articleWithLike);
  };

  update = async (entity: ArticleEntity) => {
    const updatedarticle = await this._prisma.article.update({
      where: { id: entity.id },
      data: {
        ...ArticleMapper.toPersistent(entity),
        updatedAt: new Date(),
      },
    });

    return ArticleMapper.toEntity(updatedarticle);
  };

  updateArticleLike = async (userId: string, articleId: string, isLiked: boolean) => {
    const updatedArticleLike = await this._prisma.articleLike.update({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
      data: {
        isLiked,
      },
      include: {
        article: true,
      },
    });

    const articleWithLike = {
      ...updatedArticleLike.article,
      ArticleLike: [updatedArticleLike],
    }

    return ArticleMapper.toEntity(articleWithLike);
  };

  delete = async (articleId: string) => {
    const deletedArticle = await this._prisma.article.delete({
      where: { id: articleId },
    });
  };

  count = async () => {
    const totalCount = await this._prisma.article.count();

    return totalCount;
  };
}
