import { ArticleService } from "../03-service/article.service.js"; 
const articleService = new ArticleService(); 

export class ArticleController {
  create = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const article = await articleService.create({ title, content }); 
      res.status(201).json(article); 
    } catch (e) {
      next(e);
    }
  };

  detail = async (req, res, next) => {
    try {
      const article = await articleService.getById(req.params.id);
      res.status(200).json(article);
    } catch (e) {
      next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const updated = await articleService.update(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (e) {
      next(e);
    }
  };

  remove = async (req, res, next) => {
    try {
      await articleService.delete(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  list = async (req, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
      const skip = (page - 1) * limit;
      const search = req.query.search || null;
      const sort = req.query.sort === 'recent' ? 'recent' : null;

      const result = await articleService.list({ skip, take: limit, search, sort });
      res.status(200).json({ ...result, page, limit });
    } catch (e) {
      next(e);
    }
  };
}