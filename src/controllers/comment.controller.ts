import { RequestHandler } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { CreateCommentDTO, UpdateCommentDTO } from "../types/dto";
import { commentService } from "../services/comment.service";

export const listForProduct: RequestHandler = async (req, res) => {
  res.json(
    await commentService.listByProduct(
      req.params.productId as unknown as number,
    ),
  );
};

export const listForArticle: RequestHandler = async (req, res) => {
  res.json(
    await commentService.listByArticle(
      req.params.articleId as unknown as number,
    ),
  );
};

export const createForProduct: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<CreateCommentDTO>;
  res
    .status(201)
    .json(
      await commentService.createForProduct(
        user.id,
        req.params.productId as unknown as number,
        validated,
      ),
    );
};

export const createForArticle: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<CreateCommentDTO>;
  res
    .status(201)
    .json(
      await commentService.createForArticle(
        user.id,
        req.params.articleId as unknown as number,
        validated,
      ),
    );
};

export const update: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<UpdateCommentDTO>;
  res.json(
    await commentService.update(
      user.id,
      req.params.commentId as unknown as number,
      validated,
    ),
  );
};

export const remove: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await commentService.remove(
    user.id,
    req.params.commentId as unknown as number,
  );
  res.status(204).end();
};
