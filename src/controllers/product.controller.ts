import { RequestHandler } from "express";
import { AuthedRequest, Validated } from "../types/http";
import { CreateProductDTO, UpdateProductDTO } from "../types/dto";
import { productService } from "../services/product.service";

export const list: RequestHandler = async (req, res) => {
  const { offset = "0", limit = "20", sort = "recent", q } = req.query as any;
  const userId = (req as AuthedRequest).user?.id ?? null;

  const data = await productService.list(userId, {
    offset: Number(offset),
    limit: Number(limit),
    sort,
    q,
  });
  res.json(data);
};

export const getById: RequestHandler = async (req, res) => {
  const userId = (req as AuthedRequest).user?.id ?? null;
  const id = req.params.productId as unknown as number;
  res.json(await productService.getById(userId, id));
};

export const mine: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  res.json(await productService.mine(user.id));
};

export const create: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<CreateProductDTO>;
  res.status(201).json(await productService.create(user.id, validated));
};

export const update: RequestHandler = async (req, res) => {
  const { user, validated } = req as AuthedRequest &
    Validated<UpdateProductDTO>;
  const id = req.params.productId as unknown as number;
  res.json(await productService.update(user.id, id, validated));
};

export const remove: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  const id = req.params.productId as unknown as number;
  await productService.remove(user.id, id);
  res.status(204).end();
};

export const like: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await productService.like(user.id, req.params.productId as unknown as number);
  res.json({ ok: true });
};

export const unlike: RequestHandler = async (req, res) => {
  const { user } = req as AuthedRequest;
  await productService.unlike(
    user.id,
    req.params.productId as unknown as number,
  );
  res.json({ ok: true });
};
