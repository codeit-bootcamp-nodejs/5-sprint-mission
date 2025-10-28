import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/comment.service";

export const listForProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cursor, limit = "10" } = req.query as any;
    res
      .status(200)
      .json(
        await commentService.listForProduct(
          req.user?.id,
          Number(req.params.productId),
          cursor ? Number(cursor) : undefined,
          Number(limit),
        ),
      );
  } catch (e) {
    next(e);
  }
};

export const listForArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cursor, limit = "10" } = req.query as any;
    res
      .status(200)
      .json(
        await commentService.listForArticle(
          req.user?.id,
          Number(req.params.articleId),
          cursor ? Number(cursor) : undefined,
          Number(limit),
        ),
      );
  } catch (e) {
    next(e);
  }
};

export const createForProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const created = await commentService.createForProduct(
      req.user!.id,
      Number(req.params.productId),
      req.validated.content,
    );
    res.status(201).json({
      id: created.id,
      content: created.content,
      createdAt: created.createdAt,
    });
  } catch (e) {
    next(e);
  }
};

export const createForArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const created = await commentService.createForArticle(
      req.user!.id,
      Number(req.params.articleId),
      req.validated.content,
    );
    res.status(201).json({
      id: created.id,
      content: created.content,
      createdAt: created.createdAt,
    });
  } catch (e) {
    next(e);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updated = await commentService.update(
      req.user!.id,
      Number(req.params.commentId),
      req.validated.content,
    );
    res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await commentService.remove(req.user!.id, Number(req.params.commentId));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
