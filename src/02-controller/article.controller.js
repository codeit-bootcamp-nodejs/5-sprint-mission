import { ArticleService } from "../03-service/article.service.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const articleService = new ArticleService();

export class ArticleController {
  create = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const article = await articleService.create({ title, content, userId: req.user.id });
      res.status(201).json(article);
    } catch (e) { next(e); }
  };

  detail = async (req, res, next) => {
    try {
      const article = await articleService.getById(req.params.id, req.user?.id);
      res.status(200).json(article);
    } catch (e) { next(e); }
  };

  update = async (req, res, next) => {
    try {
      const article = await prisma.article.findUnique({ where: { id: Number(req.params.id) } });
      if (!article || article.userId !== req.user.id) return res.status(403).json({ message: "권한 없음" });
      const updated = await articleService.update(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (e) { next(e); }
  };

  remove = async (req, res, next) => {
    try {
      const article = await prisma.article.findUnique({ where: { id: Number(req.params.id) } });
      if (!article || article.userId !== req.user.id) return res.status(403).json({ message: "권한 없음" });
      await articleService.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  };

  list = async (req, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
      const skip = (page - 1) * limit;
      const search = req.query.search || null;
      const sort = req.query.sort === 'recent' ? 'recent' : null;
      const result = await articleService.list({ skip, take: limit, search, sort, userId: req.user?.id });
      res.status(200).json({ ...result, page, limit });
    } catch (e) { next(e); }
  };

  like = async (req, res, next) => {
    try {
      await prisma.articleLikes.create({
        data: { userId: req.user.id, articleId: Number(req.params.id) }
      });
      res.status(201).json({ message: "좋아요 완료" });
    } catch (e) { next(e); }
  };

  unlike = async (req, res, next) => {
    try {
      await prisma.articleLikes.delete({
        where: { userId_articleId: { userId: req.user.id, articleId: Number(req.params.id) } }
      });
      res.status(200).json({ message: "좋아요 취소" });
    } catch (e) { next(e); }
  };
}
