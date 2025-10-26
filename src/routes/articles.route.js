import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { validateCreateArticle, validateUpdateArticle } from "../middlewares/validator.js";

const router = Router();
router
  .route("/")

  .get(async (req, res, next) => {
    try {
      const { offset = "0", limit = "20", sort = "recent", q } = req.query;
      const where = q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
            ],
          }
        : {};
      const orderBy =
        sort === "recent" ? [{ createdAt: "desc" }] : [{ id: "asc" }];
      const [items, total] = await prisma.$transaction([
        prisma.article.findMany({
          where,
          orderBy,
          skip: Number(offset),
          take: Number(limit),
          select: { id: true, title: true, content: true, createdAt: true },
        }),
        prisma.article.count({ where }),
      ]);
      res.status(200).json({ items, total });
    } catch (e) {
      next(e);
    }
  })

  .post(validateCreateArticle, async (req, res, next) => {
    try {
      const created = await prisma.article.create({ data: req.validated });
      res
        .status(201)
        .json({
          id: created.id,
          title: created.title,
          content: created.content,
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
      const a = await prisma.article.findUnique({ where: { id } });
      if (!a)
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      res
        .status(200)
        .json({
          id: a.id,
          title: a.title,
          content: a.content,
          createdAt: a.createdAt,
        });
    } catch (e) {
      next(e);
    }
  })

  .patch(validateUpdateArticle, async (req, res, next) => {
    try {
      const id = req.params.id;
      const exists = await prisma.article.findUnique({ where: { id } });
      if (!exists)
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      const updated = await prisma.article.update({
        where: { id },
        data: req.validated,
      });
      res.status(200).json(updated);
    } catch (e) {
      next(e);
    }
  })
  
  .delete(async (req, res, next) => {
    try {
      const id = req.params.id;
      await prisma.article.delete({ where: { id } });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });
export default router;
