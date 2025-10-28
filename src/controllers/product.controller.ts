import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";

export const mine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await productService.mine(req.user!.id));
  } catch (e) {
    next(e);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset = "0", limit = "20", sort = "recent", q } = req.query as any;
    res
      .status(200)
      .json(
        await productService.list(
          req.user?.id,
          q,
          Number(offset),
          Number(limit),
          sort,
        ),
      );
  } catch (e) {
    next(e);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res
      .status(201)
      .json(await productService.create(req.user!.id, req.validated));
  } catch (e) {
    next(e);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res
      .status(200)
      .json(await productService.get(Number(req.params.id), req.user?.id));
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
    res
      .status(200)
      .json(
        await productService.update(
          req.user!.id,
          Number(req.params.id),
          req.validated,
        ),
      );
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
    await productService.remove(req.user!.id, Number(req.params.id));
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .status(200)
      .json(await productService.like(req.user!.id, Number(req.params.id)));
  } catch (e) {
    next(e);
  }
};

export const unlike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res
      .status(200)
      .json(await productService.unlike(req.user!.id, Number(req.params.id)));
  } catch (e) {
    next(e);
  }
};
