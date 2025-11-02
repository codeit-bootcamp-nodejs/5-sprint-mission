import { AuthedRequest, Validated } from "../types/http";
import { CreateProductDTO, UpdateProductDTO } from "../types/dto";
import { productService } from "../services/product.service";
import { Router, RequestHandler } from "express";

const router = Router();
export const list: RequestHandler = async (req, res) => {
  const {
    offset = "0",
    limit = "20",
    sort = "recent",
    q,
  } = req.query as {
    offset?: string;
    limit?: string;
    sort?: "recent" | "asc";
    q?: string;
  };

  const viewerId = (req as AuthedRequest).user?.id ?? null;

  const data = await productService.list(viewerId, {
    offset: Number(offset) || 0,
    limit: Number(limit) || 20,
    sort,
    q: q?.toString() ?? undefined,
  });

  res.json(data);
};

export const getById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const viewerId = (req as AuthedRequest).user?.id ?? null;
  const data = await productService.getById(viewerId, id);
  res.json(data);
};

export const mine: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const data = await productService.mine(user.id);
  res.json(data);
};

export const create: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest &
    Validated<CreateProductDTO>;
  const created = await productService.create(user.id, validated);
  res.status(201).json(created);
};

export const update: RequestHandler = async (req, res) => {
  const { user, validated } = req as unknown as AuthedRequest &
    Validated<UpdateProductDTO>;
  const id = Number(req.params.id);
  const updated = await productService.update(user.id, id, validated);
  res.json(updated);
};

export const remove: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const id = Number(req.params.id);
  await productService.remove(user.id, id);
  res.status(204).end();
};

export const like: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const id = Number(req.params.id);
  await productService.like(user.id, id);
  res.status(200).json({ ok: true });
};

export const unlike: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const id = Number(req.params.id);
  await productService.unlike(user.id, id);
  res.status(200).json({ ok: true });
};

export default router;
