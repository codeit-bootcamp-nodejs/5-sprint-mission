import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  validateCreateArticle,
  validateUpdateArticle,
} from "../middlewares/validator.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.js";
import { parseIdParam } from "../middlewares/params.js";

const router = Router();

router
  .route("/")
  .get(optionalAuthenticate, async (req, res, next) => {
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

      let result = items;
      if (req.user) {
        const articleIds = items.map((a) => a.id);
        const likes = await prisma.likeArticle.findMany({
          where: { userId: req.user.id, articleId: { in: articleIds } },
          select: { articleId: true },
        });
        const likedSet = new Set(likes.map((l) => l.articleId));
        result = items.map((a) => ({ ...a, isLiked: likedSet.has(a.id) }));
      }

      res.status(200).json({ items: result, total });
    } catch (e) {
      next(e);
    }
  })
  .post(authenticate, validateCreateArticle, async (req, res, next) => {
    try {
      const created = await prisma.article.create({
        data: { ...req.validated, userId: req.user.id },
      });
      res.status(201).json({
        id: created.id,
        title: created.title,
        content: created.content,
        createdAt: created.createdAt,
        isLiked: false,
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
      const a = await prisma.article.findUnique({ where: { id } });
      if (!a)
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

      let isLiked = false;
      if (req.user) {
        const like = await prisma.likeArticle.findUnique({
          where: { userId_articleId: { userId: req.user.id, articleId: id } },
        });
        isLiked = !!like;
      }
      res.status(200).json({
        id: a.id,
        title: a.title,
        content: a.content,
        createdAt: a.createdAt,
        isLiked,
      });
    } catch (e) {
      next(e);
    }
  })
  .patch(
    authenticate,
    parseIdParam(),
    validateUpdateArticle,
    async (req, res, next) => {
      try {
        const id = req.params.id;
        const exists = await prisma.article.findUnique({ where: { id } });
        if (!exists)
          return res
            .status(404)
            .json({ message: "게시글을 찾을 수 없습니다." });
        if (exists.userId !== req.user.id)
          return res.status(403).json({ message: "수정 권한이 없습니다." });

        const updated = await prisma.article.update({
          where: { id },
          data: req.validated,
        });
        res.status(200).json({
          id: updated.id,
          title: updated.title,
          content: updated.content,
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
      const exists = await prisma.article.findUnique({ where: { id } });
      if (!exists)
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      if (exists.userId !== req.user.id)
        return res.status(403).json({ message: "삭제 권한이 없습니다." });

      await prisma.article.delete({ where: { id } });
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
      const articleId = req.params.id;
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });
      if (!article)
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

      await prisma.likeArticle.upsert({
        where: { userId_articleId: { userId: req.user.id, articleId } },
        create: { userId: req.user.id, articleId },
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
      const articleId = req.params.id;
      await prisma.likeArticle
        .delete({
          where: { userId_articleId: { userId: req.user.id, articleId } },
        })
        .catch(() => null);
      res.status(200).json({ message: "좋아요 취소", isLiked: false });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
