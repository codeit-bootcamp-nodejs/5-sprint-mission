import { ArticleService } from "../services/article-service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ArticleController {
  constructor() {
    this.articleService = new ArticleService(prisma);
  }

  createArticle = async (req, res) => {
    const userId = req.user.userId;
    const articleData = { ...req.body, userId: userId };
    const article = await this.articleService.createArticle(articleData);
    res.json(article);
  };

  getArticles = async (req, res) => {
    const articles = await this.articleService.getArticles(req.query);
    res.json(articles);
  };

  getArticleDetail = async (req, res) => {
    const articleId = parseInt(req.params.id);
    if (!articleId) throw new Exception(400, "유효하지 않은 게시글 ID입니다");
    
    const article = await this.articleService.getArticleById(articleId);
    res.json(article);
  };

  updateArticle = async (req, res) => {
    const articleId = parseInt(req.params.id);
    const updatedArticle = await this.articleService.updateArticle(
      articleId,
      req.body,
    );
    res.json(updatedArticle);
  };

  deleteArticle = async (req, res) => {
    const articleId = parseInt(req.params.id);
    await this.articleService.deleteArticle(articleId);
    res.json({ message: "게시글이 삭제되었습니다" });
  };
  
  likeArticle = async (req, res) => {
    const articleId = parseInt(req.params.id);
    const userId = req.user.userId;
    const result = await this.articleService.likeArticle(articleId, userId);
    res.json(result);
  };

  unlikeArticle = async (req, res) => {
    const articleId = parseInt(req.params.id);
    const userId = req.user.userId;
    const result = await this.articleService.unlikeArticle(articleId, userId);
    res.json(result);
  };
}
