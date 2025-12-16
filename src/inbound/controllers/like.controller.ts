import { Request, Response } from "express";
import { create } from "superstruct";
import { AuthenticatedHandler } from "../../common/types/common";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";
import { prismaClient } from "../../common/lib/prisma.client";
import { IdParamsStruct } from "../../common/validation/common.structs";

export const likeArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const existingLike = await prismaClient.like.findFirst({
    where: {
      userId,
      articleId: id,
    },
  });

  if (existingLike) {
    throw new BusinessException({
      type: BusinessExceptionType.ALREADY_LIKED,
    });
  }

  await prismaClient.like.create({
    data: {
      userId,
      articleId: id,
    },
  });

  res.status(201).send({ message: "좋아요를 눌렀습니다." });
};

export const unlikeArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  await prismaClient.like.deleteMany({
    where: {
      userId,
      articleId: id,
    },
  });

  res.send({ message: "좋아요를 취소했습니다." });
};

export const likeProduct: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const existingLike = await prismaClient.like.findFirst({
    where: {
      userId,
      productId: id,
    },
  });

  if (existingLike) {
    throw new BusinessException({
      type: BusinessExceptionType.ALREADY_LIKED,
    });
  }

  await prismaClient.like.create({
    data: {
      userId,
      productId: id,
    },
  });

  res.status(201).send({ message: "좋아요를 눌렀습니다." });
};

export const unlikeProduct: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  await prismaClient.like.deleteMany({
    where: {
      userId,
      productId: id,
    },
  });

  res.send({ message: "좋아요를 취소했습니다." });
};
