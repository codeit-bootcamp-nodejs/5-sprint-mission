import { Request, Response } from "express";
import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient";
import NotFoundError from "../lib/errors/NotFoundError";
import BadRequestError from "../lib/errors/BadRequestError";
import { IdParamsStruct } from "../structs/commonStructs";
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from "../structs/articlesStructs";
import {
  CreateCommentBodyStruct,
  GetCommentListParamsStruct,
} from "../structs/commentsStruct";
import { attachIsLiked } from "../lib/isLikedUtil";
import { AuthenticatedHandler, ExpressHandler } from "../types/common";

export const createArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res
      .status(401)
      .send({ message: "로그인된 사용자만 게시글을 등록할 수 있습니다." });
    return;
  }
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await prismaClient.article.create({
    data: { ...data, userId },
  });

  res.status(201).send(article);
};

export const getArticle: ExpressHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError("article", id);
  }

  res.send(article);
};

export const updateArticle: AuthenticatedHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const userId = req.user?.userId;
  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError("article", id);
  }
  if (article.userId !== userId) {
    res
      .status(403)
      .send({ message: "게시글 등록한 사용자만 수정할 수 있습니다." });
    return;
  }
  const updatedArticle = await prismaClient.article.update({
    where: { id },
    data,
  });

  res.send(updatedArticle);
};

export async function deleteArticle(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.user?.userId;
  const existingArticle = await prismaClient.article.findUnique({
    where: { id },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", id);
  }
  if (existingArticle.userId !== userId) {
    res
      .status(403)
      .send({ message: "게시글 등록한 사용자만 삭제할 수 있습니다." });
    return;
  }
  await prismaClient.article.delete({ where: { id } });

  res.status(204).send();
}

export async function getArticleList(
  req: Request,
  res: Response
): Promise<void> {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetArticleListParamsStruct
  );
  const userId = req.user?.userId;

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where,
  });

  const articlesWithIsLiked = await attachIsLiked(articles, userId, "article");

  res.send({
    list: articlesWithIsLiked,
    totalCount,
  });
}

export async function createComment(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res
      .status(401)
      .send({ message: "로그인된 사용자만 댓글을 등록할 수 있습니다." });
    return;
  }
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({
    where: { id: articleId },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", articleId);
  }

  const comment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      userId,
    },
  });

  res.status(201).send(comment);
}

export async function getCommentList(
  req: Request,
  res: Response
): Promise<void> {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({
    where: { id: articleId },
  });
  if (!article) {
    throw new NotFoundError("article", articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
}
