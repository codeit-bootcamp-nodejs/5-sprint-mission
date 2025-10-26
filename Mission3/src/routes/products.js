import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/auth.middleware.js";
import authOptionalMiddleware from "../middlewares/auth.optional.middleware.js";
import { validateProduct } from "../middlewares/validator/validate.product.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/", authMiddleware, validateProduct, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { name, description, price, tags } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        authorId: userId,
      },
    });

    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});

router.get("/", authOptionalMiddleware, async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, keyword = "", sort = "recent" } = req.query;
    const userId = req.user?.id;

    const whereCondition = {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ],
    };

    const products = await prisma.product.findMany({
      skip: parseInt(offset) || 0,
      take: parseInt(limit) || 10,
      where: whereCondition,
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: { likes: true },
        },
        likes: userId
          ? {
              where: { authorId: userId },
              select: { id: true },
            }
          : false,
      },
    });

    const processedProducts = products.map((product) => {
      const likeCount = product._count.likes;
      const isLiked = Array.isArray(product.likes) && product.likes.length > 0;

      delete product._count;
      delete product.likes;

      return {
        ...product,
        authorNickname: product.author.nickname,
        likeCount,
        isLiked,
      };
    });

    res.status(200).json(processedProducts);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authOptionalMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            nickname: true,
          },
        },
        _count: {
          select: { likes: true },
        },
        likes: userId
          ? {
              where: { authorId: userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    const likeCount = product._count.likes;
    const isLiked = Array.isArray(product.likes) && product.likes.length > 0;

    delete product._count;
    delete product.likes;

    const processedProduct = {
      ...product,
      authorNickname: product.author.nickname,
      likeCount,
      isLiked,
    };

    res.status(200).json(processedProduct);
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/:id",
  authMiddleware,
  validateProduct,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id: productId } = req.params;
      const { name, description, price, tags } = req.body;

      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });
      if (!product) {
        return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
      }

      if (product.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "상품을 수정할 권한이 없습니다." });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          name,
          description,
          price,
          tags,
        },
      });

      res.status(200).json(updatedProduct);
    } catch (e) {
      if (e.code === "P2025") {
        return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
      }
      next(e);
    }
  },
);

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    if (product.authorId !== userId) {
      return res.status(403).json({ error: "상품을 삭제할 권한이 없습니다." });
    }

    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
    }
    next(e);
  }
});

router.post("/:id/like", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    const existingLike = await prisma.productLike.findUnique({
      where: {
        authorId_productId: {
          authorId: userId,
          productId: parseInt(productId),
        },
      },
    });

    let isLiked;
    if (existingLike) {
      await prisma.productLike.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      await prisma.productLike.create({
        data: {
          authorId: userId,
          productId: parseInt(productId),
        },
      });
      isLiked = true;
    }

    const likeCount = await prisma.productLike.count({
      where: { productId: parseInt(productId) },
    });

    res.status(200).json({
      productId: parseInt(productId),
      userId,
      isLiked,
      likeCount,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
