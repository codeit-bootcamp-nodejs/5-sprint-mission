import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../middlewares/validator.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.js";
import { parseIdParam } from "../middlewares/params.js";

const router = Router();

router.get("/mine", authenticate, async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.user.id },
      select: { id: true, name: true, price: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(products);
  } catch (e) {
    next(e);
  }
});

router
  .route("/")
  .get(optionalAuthenticate, async (req, res, next) => {
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
          select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      let result = items;
      if (req.user) {
        const productIds = items.map((p) => p.id);
        const likes = await prisma.likeProduct.findMany({
          where: { userId: req.user.id, productId: { in: productIds } },
          select: { productId: true },
        });
        const likedSet = new Set(likes.map((l) => l.productId));
        result = items.map((p) => ({ ...p, isLiked: likedSet.has(p.id) }));
      }

      res.status(200).json({ items: result, total });
    } catch (e) {
      next(e);
    }
  })
  .post(authenticate, validateCreateProduct, async (req, res, next) => {
    try {
      const created = await prisma.product.create({
        data: { ...req.validated, userId: req.user.id },
      });
      const isLiked = false;
      res.status(201).json({
        id: created.id,
        name: created.name,
        description: created.description,
        price: created.price,
        tags: created.tags,
        createdAt: created.createdAt,
        isLiked,
      });
    } catch (e) {
      next(e);
    }
  });

router
  .route("/:id")
  .get(optionalAuthenticate, parseIdParam(), async (req, res, next) => {
    try {
      const id = req.params.id;
      const p = await prisma.product.findUnique({ where: { id } });
      if (!p)
        return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

      let isLiked = false;
      if (req.user) {
        const like = await prisma.likeProduct.findUnique({
          where: { userId_productId: { userId: req.user.id, productId: id } },
        });
        isLiked = !!like;
      }
      res.status(200).json({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        tags: p.tags,
        createdAt: p.createdAt,
        isLiked,
      });
    } catch (e) {
      next(e);
    }
  })
  .patch(
    authenticate,
    parseIdParam(),
    validateUpdateProduct,
    async (req, res, next) => {
      try {
        const id = req.params.id;
        const exists = await prisma.product.findUnique({ where: { id } });
        if (!exists)
          return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
        if (exists.userId !== req.user.id)
          return res.status(403).json({ message: "수정 권한이 없습니다." });

        const updated = await prisma.product.update({
          where: { id },
          data: req.validated,
        });
        res.status(200).json({
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
    },
  )
  .delete(authenticate, parseIdParam(), async (req, res, next) => {
    try {
      const id = req.params.id;
      const exists = await prisma.product.findUnique({ where: { id } });
      if (!exists)
        return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      if (exists.userId !== req.user.id)
        return res.status(403).json({ message: "삭제 권한이 없습니다." });

      await prisma.product.delete({ where: { id } });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

router.post(
  "/:id/like",
  authenticate,
  parseIdParam(),
  async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product)
        return res.status(404).json({ message: "상품을 찾을 수 없습니다." });

      await prisma.likeProduct.upsert({
        where: { userId_productId: { userId: req.user.id, productId } },
        create: { userId: req.user.id, productId },
        update: {},
      });
      res.status(200).json({ message: "좋아요 완료", isLiked: true });
    } catch (e) {
      next(e);
    }
  },
);

router.delete(
  "/:id/like",
  authenticate,
  parseIdParam(),
  async (req, res, next) => {
    try {
      const productId = req.params.id;
      await prisma.likeProduct
        .delete({
          where: { userId_productId: { userId: req.user.id, productId } },
        })
        .catch(() => null);
      res.status(200).json({ message: "좋아요 취소", isLiked: false });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
