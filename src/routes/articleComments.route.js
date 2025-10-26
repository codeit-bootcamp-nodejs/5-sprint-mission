import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { validateCreateComment } from "../middlewares/validator.js";
const router = Router({ mergeParams: true });
router.get("/", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { cursor, limit = "10" } = req.query;
    const args = {
      where: { articleId },
      orderBy: { id: "desc" },
      take: Number(limit),
      select: { id: true, content: true, createdAt: true },
    };
    if (cursor) {
      args.cursor = { id: cursor.toString() };
      args.skip = 1;
    }
    const items = await prisma.comment.findMany(args);
    const nextCursor =
      items.length === Number(limit) ? items[items.length - 1].id : null;
    res.status(200).json({ items, nextCursor });
  } catch (e) {
    next(e);
  }
});
router.post("/", validateCreateComment, async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const created = await prisma.comment.create({
      data: { ...req.validated, articleId },
    });
    res
      .status(201)
      .json({
        id: created.id,
        content: created.content,
        createdAt: created.createdAt,
      });
  } catch (e) {
    next(e);
  }
});
router.patch("/:commentId", validateCreateComment, async (req, res, next) => {
  try {
    const id = req.params.commentId;
    const updated = await prisma.comment.update({
      where: { id },
      data: req.validated,
    });
    res
      .status(200)
      .json({
        id: updated.id,
        content: updated.content,
        createdAt: updated.createdAt,
      });
  } catch (e) {
    next(e);
  }
});
router.delete("/:commentId", async (req, res, next) => {
  try {
    const id = req.params.commentId;
    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
export default router;
