import { Response } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { CreateProductDTO, UpdateProductDTO } from "@/types/dto";
import { productService } from "../services/product.service";

export const list = async (req: AuthedRequest, res: Response) => {
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
  const data = await productService.list(req.user?.id ?? null, {
    offset: Number(offset) || 0,
    limit: Number(limit) || 20,
    sort,
    q: q?.toString() ?? undefined,
  });
  res.json(data);
};

export const getById = async (req: AuthedRequest, res: Response) => {
  const id = Number(req.params.id);
  const data = await productService.getById(req.user?.id ?? null, id);
  res.json(data);
};

export const mine = async (req: AuthedRequest, res: Response) => {
  const data = await productService.mine(req.user.id);
  res.json(data);
};

export const create = async (
  req: AuthedRequest & Validated<CreateProductDTO>,
  res: Response,
) => {
  const created = await productService.create(req.user.id, req.validated);
  res.status(201).json(created);
};

export const update = async (
  req: AuthedRequest & Validated<UpdateProductDTO>,
  res: Response,
) => {
  const id = Number(req.params.id);
  const updated = await productService.update(req.user.id, id, req.validated);
  res.json(updated);
};

export const remove = async (req: AuthedRequest, res: Response) => {
  const id = Number(req.params.id);
  await productService.remove(req.user.id, id);
  res.status(204).end();
};

export const like = async (req: AuthedRequest, res: Response) => {
  const id = Number(req.params.id);
  await productService.like(req.user.id, id);
  res.status(200).json({ ok: true });
};

export const unlike = async (req: AuthedRequest, res: Response) => {
  const id = Number(req.params.id);
  await productService.unlike(req.user.id, id);
  res.status(200).json({ ok: true });
};
