import { RequestHandler } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { CreateCommentDTO, UpdateCommentDTO } from "../types/dto";
import { commentService } from "../services/comment.service";

export const listForProduct: RequestHandler = async (req, res) => {
  const productId = Number(req.params.productId);
  const comments = await commentService.listByProduct(productId);
  res.json(comments);
};

export const listForArticle: RequestHandler = async (req, res) => {
  const articleId = Number(req.params.articleId);
  const comments = await commentService.listByArticle(articleId);
  res.json(comments);
};

export const createForProduct: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest & Validated<CreateCommentDTO>;
  const productId = Number(req.params.productId);
  const comment = await commentService.createForProduct(user.id, productId, validated);
  res.status(201).json(comment);
};

export const createForArticle: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest & Validated<CreateCommentDTO>;
  const articleId = Number(req.params.articleId);
  const comment = await commentService.createForArticle(user.id, articleId, validated);
  res.status(201).json(comment);
};

export const update: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest & Validated<UpdateCommentDTO>;
  const commentId = Number(req.params.commentId);
  const updated = await commentService.update(user.id, commentId, validated);
  res.json(updated);
};

export const remove: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const commentId = Number(req.params.commentId);
  await commentService.remove(user.id, commentId);
  res.status(204).end();
};
