import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import validateArticle from "../middlewares/validate.article.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/", validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content }
    });
    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, keyword = "", sort = "recent" } = req.query;

    const articles = await prisma.article.findMany({
      skip: parseInt(offset) || 0,
      take: parseInt(limit) || 10,
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.json(articles);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    res.json(article);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", validateArticle, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    res.json(updatedArticle);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
    }
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({ 
      where: { id: parseInt(id) } 
    });

    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
    }
    next(e);
  }
});

export default router;