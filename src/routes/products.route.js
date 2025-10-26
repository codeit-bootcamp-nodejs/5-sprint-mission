import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../middlewares/validator.js";
const router = Router();
router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const { offset = "0", limit = "20", sort = "recent", q } = req.query;
      const where = q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {};
      const orderBy =
        sort === "recent" ? [{ createdAt: "desc" }] : [{ id: "asc" }];
      const [items, total] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          orderBy,
          skip: Number(offset),
          take: Number(limit),
          select: { id: true, name: true, price: true, createdAt: true },
        }),
        prisma.product.count({ where }),
      ]);
      res.status(200).json({ items, total });
    } catch (e) {
      next(e);
    }
  })
  .post(validateCreateProduct, async (req, res, next) => {
    try {
      const created = await prisma.product.create({ data: req.validated });
      res
        .status(201)
        .json({
          id: created.id,
          name: created.name,
          description: created.description,
          price: created.price,
          tags: created.tags,
          createdAt: created.createdAt,
        });
    } catch (e) {
      next(e);
    }
  });
router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const id = req.params.id;
      const p = await prisma.product.findUnique({ where: { id } });
      if (!p)
        return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      res
        .status(200)
        .json({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          tags: p.tags,
          createdAt: p.createdAt,
        });
    } catch (e) {
      next(e);
    }
  })
  .patch(validateUpdateProduct, async (req, res, next) => {
    try {
      const id = req.params.id;
      const exists = await prisma.product.findUnique({ where: { id } });
      if (!exists)
        return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      const updated = await prisma.product.update({
        where: { id },
        data: req.validated,
      });
      res
        .status(200)
        .json({
          id: updated.id,
          name: updated.name,
          description: updated.description,
          price: updated.price,
          tags: updated.tags,
          createdAt: updated.createdAt,
        });
    } catch (e) {
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const id = req.params.id;
      await prisma.product.delete({ where: { id } });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });
export default router;
