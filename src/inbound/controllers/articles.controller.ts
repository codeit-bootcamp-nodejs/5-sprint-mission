import { Request, Response } from "express";
import { create } from "superstruct";
import { AuthenticatedHandler } from "../../common/types/common";
import { prismaClient } from "../../common/lib/prisma.client";
import { CreateArticleService } from "../../domain/services/create.article.service";
import { UpdateArticleService } from "../../domain/services/update.article.service";
import { DeleteArticleService } from "../../domain/services/delete.article.service";
import { GetArticleService } from "../../domain/services/get.article.service";
import { GetArticleListService } from "../../domain/services/get.article.list.service";
import { PrismaArticleRepository } from "../../outbound/repositories/article.repo";
import {
  IdParamsStruct,
  PageParamsStruct,
} from "../../common/validation/common.structs";
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
} from "../../common/validation/articles.structs";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";

const articleRepository = new PrismaArticleRepository(prismaClient);
const createArticleService = new CreateArticleService(articleRepository);
const updateArticleService = new UpdateArticleService(articleRepository);
const deleteArticleService = new DeleteArticleService(articleRepository);
const getArticleService = new GetArticleService(articleRepository);
const getArticleListService = new GetArticleListService(articleRepository);

export const createArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const { title, content, image } = create(req.body, CreateArticleBodyStruct);

  const article = await createArticleService.create({
    title,
    content,
    image,
    userId,
  });

  res.status(201).json(article);
};

export const getArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);

  const article = await getArticleService.get(id);

  res.json(article);
};

export const getArticleList: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { page, pageSize } = create(req.query, PageParamsStruct);

  const articles = await getArticleListService.getList({
    page,
    pageSize,
  });

  res.json(articles);
};

export const updateArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const { id } = create(req.params, IdParamsStruct);
  const updateData = create(req.body, UpdateArticleBodyStruct);

  const updatedArticle = await updateArticleService.update({
    id,
    data: updateData,
    userId,
  });

  res.json(updatedArticle);
};

export const deleteArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const { id } = create(req.params, IdParamsStruct);

  await deleteArticleService.delete({ id, userId });

  res.json({ message: "게시글을 삭제했습니다." });
};
