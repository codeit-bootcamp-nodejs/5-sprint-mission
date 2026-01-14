import { Prisma, PrismaClient } from "@prisma/client";
import { QueryType } from "../../../01-inbound/request/query.request";
import {
  NewArticle,
  PersistedArticle,
} from "../../../02-application/command/entity/article";
import { IArticleCommandRepository } from "../../../02-application/port/repositories/command/I.article.repository";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../../shared/exception/exception";
import { ArticleMapper } from "../../mapper/article.mapper";

export type PersistArticle = Prisma.ArticleGetPayload<{}>;

export const createArticleCommandRepository = (
  prisma: PrismaClient,
): IArticleCommandRepository => {
  const findAll = async (query: QueryType) => {
    const { offset, limit, search, sort } = query;

    const condition: Prisma.ArticleWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      where: condition,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: sort ? "desc" : "asc",
      },
    });

    const articleEntities = articles.map((article: PersistArticle) => {
      return ArticleMapper.toPersist(article);
    });

    return articleEntities;
  };

  const findById = async (id: string) => {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR,
      });
    }

    return ArticleMapper.toPersist(article);
  };

  const save = async (entity: NewArticle) => {
    const { title, content, userId } = entity;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return ArticleMapper.toPersist(article);
  };

  const updateArticle = async (
    foundEntity: PersistedArticle,
    newEntity: NewArticle,
  ) => {
    const { id } = foundEntity;
    const { title, content } = newEntity;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return ArticleMapper.toPersist(article);
  };

  const deleteById = async (id: string) => {
    await prisma.article.delete({
      where: { id },
    });
  };

  return {
    findAll,
    findById,
    save,
    update: updateArticle,
    remove: deleteById,
  };
};
