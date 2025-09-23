import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import validateComment from "../middlewares/validate.comment.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/product/:productId", validateComment, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: { 
        content, 
        productId: parseInt(productId) 
      },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

router.post("/article/:articleId", validateComment, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: { 
        content, 
        articleId: parseInt(articleId) 
      },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

router.get("/product/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { cursor, limit = 5 } = req.query;

    const comments = await prisma.comment.findMany({
      take: parseInt(limit) || 5,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      where: { productId: parseInt(productId) },
      orderBy: { id: "asc" },
      select: { 
        id: true, 
        content: true, 
        createdAt: true 
      },
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

router.get("/article/:articleId", async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { cursor, limit = 5 } = req.query;

    const comments = await prisma.comment.findMany({
      take: parseInt(limit) || 5,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      where: { articleId: parseInt(articleId) },
      orderBy: { id: "asc" },
      select: { 
        id: true, 
        content: true, 
        createdAt: true 
      },
    });

    res.json(comments);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", validateComment, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.json(updatedComment);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
    }
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({ 
      where: { id: parseInt(id) } 
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