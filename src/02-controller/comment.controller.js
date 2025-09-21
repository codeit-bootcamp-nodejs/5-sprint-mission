import { CommentService } from "../03-service/comment.service.js";
const commentService = new CommentService();

export class CommentController {
  createForProduct = async (req, res, next) => {
    try {
      const { content } = req.body;
      const productId = req.params.productId;
      const data = await commentService.createForProduct(productId, content);
      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  };

  createForArticle = async (req, res, next) => {
    try {
      const { content } = req.body;
      const articleId = req.params.articleId;
      const data = await commentService.createForArticle(articleId, content);
      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const { content } = req.body;
      const commentId = req.params.id;
      const data = await commentService.update(commentId, content);
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  };

  remove = async (req, res, next) => {
    try {
      await commentService.delete(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  listForProduct = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
      const cursor = req.query.cursor ? Number(req.query.cursor) : null;
      const result = await commentService.listForProduct(productId, { limit, cursor });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  listForArticle = async (req, res, next) => {
    try {
      const articleId = req.params.articleId;
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
      const cursor = req.query.cursor ? Number(req.query.cursor) : null;
      const result = await commentService.listForArticle(articleId, { limit, cursor });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
