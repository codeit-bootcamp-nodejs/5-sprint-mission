import { Request, Response } from "express";
import { create } from "superstruct";
import { prismaClient } from "../../common/lib/prisma.client";
import {
  CreateCommentBodyStruct,
  UpdateCommentBodyStruct,
} from "../../common/validation/comments.struct";
import { IdParamsStruct } from "../../common/validation/common.structs";
import { AuthenticatedHandler } from "../../common/types/common";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";
import { notifyCommentOnArticle } from "../../domain/services/comment.notification.service";

export const createComment: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTORIZED_REQUEST,
    });
  }

  const { content } = create(req.body, CreateCommentBodyStruct);
  const { id: articleId } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new BusinessException({
      type: BusinessExceptionType.ARTICLE_NOT_FOUND,
    });
  }

  const comment = await prismaClient.comment.create({
    data: {
      content,
      userId,
      articleId,
    },
  });

  // 댓글 알림 전송
  await notifyCommentOnArticle(articleId, userId, content);

  res.status(201).json(comment);
};

export const updateComment: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const userId = req.user?.userId;

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new BusinessException({
      type: BusinessExceptionType.COMMENT_NOT_FOUND,
    });
  }
  if (existingComment.userId !== userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTHORIZED_MODIFICATION,
    });
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  res.send(updatedComment);
};

export const deleteComment: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new BusinessException({
      type: BusinessExceptionType.COMMENT_NOT_FOUND,
    });
  }
  if (existingComment.userId !== userId) {
    throw new BusinessException({
      type: BusinessExceptionType.UNAUTHORIZED_MODIFICATION,
    });
  }

  await prismaClient.comment.delete({ where: { id } });
  res.status(204).send();
};
