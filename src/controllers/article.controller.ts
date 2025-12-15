import { RequestHandler } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { CreateArticleDTO, UpdateArticleDTO } from "../types/dto";
import { articleService } from "../services/article.service";

export const list: RequestHandler = async (req, res) => {
  const userId = (req as AuthedRequest).user?.id ?? null;
  const { offset = "0", limit = "20", sort = "recent" } = req.query as any;

  res.json(
    await articleService.list(userId, {
      offset: Number(offset),
      limit: Number(limit),
      sort,
    }),
  );
};

export const getById: RequestHandler = async (req, res) => {
  const userId = (req as AuthedRequest).user?.id ?? null;
  res.json(await articleService.getById(userId, Number(req.params.id)));
};

export const create: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<CreateArticleDTO>;
  res.status(201).json(await articleService.create(user.id, validated));
};

export const update: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<UpdateArticleDTO>;
  res.json(
    await articleService.update(user.id, Number(req.params.id), validated),
  );
};

export const remove: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await articleService.remove(user.id, Number(req.params.id));
  res.status(204).end();
};

export const like: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await articleService.like(user.id, Number(req.params.id));
  res.json({ ok: true });
};

export const unlike: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await articleService.unlike(user.id, Number(req.params.id));
  res.json({ ok: true });
};
