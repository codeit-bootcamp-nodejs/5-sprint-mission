import { RequestHandler } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { CreateArticleDTO, UpdateArticleDTO } from "@/types/dto";
import { articleService } from "../services/article.service";

export const list: RequestHandler = async (req, res) => {
  const {
    offset = "0",
    limit = "20",
    sort = "recent",
  } = req.query as {
    offset?: string;
    limit?: string;
    sort?: "recent" | "asc";
  };
  const viewerId = (req as AuthedRequest).user?.id ?? null;
  const data = await articleService.list(viewerId, {
    offset: Number(offset) || 0,
    limit: Number(limit) || 20,
    sort,
  });
  res.json(data);
};

export const getById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const viewerId = (req as AuthedRequest).user?.id ?? null;
  const data = await articleService.getById(viewerId, id);
  res.json(data);
};

export const create: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest &
    Validated<CreateArticleDTO>;
  const data = await articleService.create(user.id, validated);
  res.status(201).json(data);
};

export const update: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest &
    Validated<UpdateArticleDTO>;
  const id = Number(req.params.id);
  const data = await articleService.update(user.id, id, validated);
  res.json(data);
};

export const remove: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const id = Number(req.params.id);
  await articleService.remove(user.id, id);
  res.status(204).end();
};

export const like: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const id = Number(req.params.id);
  await articleService.like(user.id, id);
  res.status(200).json({ ok: true });
};

export const unlike: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const id = Number(req.params.id);
  await articleService.unlike(user.id, id);
  res.status(200).json({ ok: true });
};
