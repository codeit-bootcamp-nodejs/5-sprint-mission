import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateComment } from "../middlewares/validator/validate.comment.js";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/product/:productId",
  authMiddleware,
  validateComment,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { productId } = req.params;
      const { content } = req.body;

      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });
      if (!product) {
        return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
      }

      const comment = await prisma.productComment.create({
        data: {
          content,
          authorId: userId,
          productId: parseInt(productId),
        },
      });

      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  "/article/:articleId",
  authMiddleware,
  validateComment,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { articleId } = req.params;
      const { content } = req.body;

      const article = await prisma.article.findUnique({
        where: { id: parseInt(articleId) },
      });
      if (!article) {
        return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
      }

      const comment = await prisma.articleComment.create({
        data: {
          content,
          authorId: userId,
          articleId: parseInt(articleId),
        },
      });

      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  },
);

router.get("/product/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { cursor, limit = 5 } = req.query;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다." });
    }

    const comments = await prisma.productComment.findMany({
      take: parseInt(limit) || 5,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      where: { productId: parseInt(productId) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { nickname: true },
        },
      },
    });

    const processedComments = comments.map((comment) => ({
      ...comment,
      authorNickname: comment.author.nickname,
      author: undefined,
    }));

    res.status(200).json(processedComments);
  } catch (e) {
    next(e);
  }
});

router.get("/article/:articleId", async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { cursor, limit = 5 } = req.query;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
    });
    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const comments = await prisma.articleComment.findMany({
      take: parseInt(limit) || 5,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      where: { articleId: parseInt(articleId) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { nickname: true },
        },
      },
    });

    const processedComments = comments.map((comment) => ({
      ...comment,
      authorNickname: comment.author.nickname,
      author: undefined,
    }));

    res.status(200).json(processedComments);
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/product/:commentId",
  authMiddleware,
  validateComment,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { commentId } = req.params;
      const { content } = req.body;

      const comment = await prisma.productComment.findUnique({
        where: { id: parseInt(commentId) },
      });
      if (!comment) {
        return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
      }

      if (comment.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "댓글을 수정할 권한이 없습니다." });
      }

      const updatedComment = await prisma.productComment.update({
        where: { id: parseInt(commentId) },
        data: { content },
      });

      res.status(200).json(updatedComment);
    } catch (e) {
      if (e.code === "P2025") {
        return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
      }
      next(e);
    }
  },
);

router.patch(
  "/article/:commentId",
  authMiddleware,
  validateComment,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { commentId } = req.params;
      const { content } = req.body;

      const comment = await prisma.articleComment.findUnique({
        where: { id: parseInt(commentId) },
      });
      if (!comment) {
        return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
      }

      if (comment.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "댓글을 수정할 권한이 없습니다." });
      }

      const updatedComment = await prisma.articleComment.update({
        where: { id: parseInt(commentId) },
        data: { content },
      });

      res.status(200).json(updatedComment);
    } catch (e) {
      if (e.code === "P2025") {
        return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
      }
      next(e);
    }
  },
);

router.delete("/product/:commentId", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { commentId } = req.params;

    const comment = await prisma.productComment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ error: "댓글을 삭제할 권한이 없습니다." });
    }

    await prisma.productComment.delete({
      where: { id: parseInt(commentId) },
    });

    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
    }
    next(e);
  }
});

router.delete("/article/:commentId", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { commentId } = req.params;

    const comment = await prisma.articleComment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ error: "댓글을 삭제할 권한이 없습니다." });
    }

    await prisma.articleComment.delete({
      where: { id: parseInt(commentId) },
    });

    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
    }
    next(e);
  }
});

export default router;
