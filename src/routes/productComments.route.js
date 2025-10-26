import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { validateCreateComment } from "../middlewares/validator.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.js";
import { parseIdParam } from "../middlewares/params.js";

const router = Router({ mergeParams: true });

router.get(
  "/",
  optionalAuthenticate,
  parseIdParam("productId"),
  async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const { cursor, limit = "10" } = req.query;
      const args = {
        where: { productId },
        orderBy: { id: "desc" },
        take: Number(limit),
        select: { id: true, content: true, createdAt: true, userId: true },
      };
      if (cursor) {
        args.cursor = { id: Number(cursor) };
        args.skip = 1;
      }
      const items = await prisma.comment.findMany(args);
      const nextCursor =
        items.length === Number(limit) ? items[items.length - 1].id : null;

      const result = items.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        mine: req.user ? c.userId === req.user.id : false,
      }));

      res.status(200).json({ items: result, nextCursor });
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  "/",
  authenticate,
  parseIdParam("productId"),
  validateCreateComment,
  async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const created = await prisma.comment.create({
        data: { ...req.validated, productId, userId: req.user.id },
      });
      res.status(201).json({
        id: created.id,
        content: created.content,
        createdAt: created.createdAt,
      });
    } catch (e) {
      next(e);
    }
  },
);

router.patch(
  "/:commentId",
  authenticate,
  parseIdParam("commentId"),
  validateCreateComment,
  async (req, res, next) => {
    try {
      const id = req.params.commentId;
      const exists = await prisma.comment.findUnique({ where: { id } });
      if (!exists)
        return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
      if (exists.userId !== req.user.id)
        return res.status(403).json({ message: "수정 권한이 없습니다." });

      const updated = await prisma.comment.update({
        where: { id },
        data: req.validated,
      });
      res.status(200).json({
        id: updated.id,
        content: updated.content,
        createdAt: updated.createdAt,
      });
    } catch (e) {
      next(e);
    }
  },
);

router.delete(
  "/:commentId",
  authenticate,
  parseIdParam("commentId"),
  async (req, res, next) => {
    try {
      const id = req.params.commentId;
      const exists = await prisma.comment.findUnique({ where: { id } });
      if (!exists)
        return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
      if (exists.userId !== req.user.id)
        return res.status(403).json({ message: "삭제 권한이 없습니다." });

      await prisma.comment.delete({ where: { id } });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
);

export default router;
