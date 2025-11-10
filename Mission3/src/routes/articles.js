import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/auth.middleware.js";
import authOptionalMiddleware from "../middlewares/auth.optional.middleware.js";
import { validateArticle } from "../middlewares/validator/validate.article.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/", authMiddleware, validateArticle, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { title, content } = req.body;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });
    res.status(201).json(article);
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
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ],
    };

    const articles = await prisma.article.findMany({
      skip: parseInt(offset) || 0,
      take: parseInt(limit) || 10,
      where: whereCondition,
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: {
        id: true,
        title: true,
        content: true,
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
              where: { userId: userId },
              select: { id: true },
            }
          : false,
      },
    });

    const processedArticles = articles.map((article) => {
      const likeCount = article._count.likes;
      const isLiked = Array.isArray(article.likes) && article.likes.length > 0;

      delete article._count;
      delete article.likes;

      return {
        ...article,
        authorNickname: article.author.nickname,
        likeCount,
        isLiked,
      };
    });

    res.status(200).json(processedArticles);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authOptionalMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        content: true,
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
              where: { userId: userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const likeCount = article._count.likes;
    const isLiked = Array.isArray(article.likes) && article.likes.length > 0;

    delete article._count;
    delete article.likes;

    const processedArticle = {
      ...article,
      authorNickname: article.author.nickname,
      likeCount,
      isLiked,
    };

    res.status(200).json(processedArticle);
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/:id",
  authMiddleware,
  validateArticle,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id: articleId } = req.params;
      const { title, content } = req.body;

      const article = await prisma.article.findUnique({
        where: { id: parseInt(articleId) },
      });
      if (!article) {
        return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
      }

      if (article.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "게시글을 수정할 권한이 없습니다." });
      }

      const updatedArticle = await prisma.article.update({
        where: { id: parseInt(articleId) },
        data: { title, content },
      });

      res.status(200).json(updatedArticle);
    } catch (e) {
      if (e.code === "P2025") {
        return res
          .status(404)
          .json({ error: "해당 게시글을 찾을 수 없습니다." });
      }
      next(e);
    }
  },
);

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: articleId } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
    });
    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    if (article.authorId !== userId) {
      return res
        .status(403)
        .json({ error: "게시글을 삭제할 권한이 없습니다." });
    }

    await prisma.article.delete({
      where: { id: parseInt(articleId) },
    });

    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
    }
    next(e);
  }
});

router.post("/:id/like", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: articleId } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
    });
    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const existingLike = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          userId: userId,
          articleId: parseInt(articleId),
        },
      },
    });

    let isLiked;
    if (existingLike) {
      await prisma.articleLike.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      await prisma.articleLike.create({
        data: {
          userId: userId,
          articleId: parseInt(articleId),
        },
      });
      isLiked = true;
    }

    const likeCount = await prisma.articleLike.count({
      where: { articleId: parseInt(articleId) },
    });

    res.status(200).json({
      articleId: parseInt(articleId),
      userId,
      isLiked,
      likeCount,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
