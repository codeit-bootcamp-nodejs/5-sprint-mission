import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { validateComment } from "../middlewares/validator/validate.comment";
import { ProductRepository } from "../repo/product.repository";
import { ArticleRepository } from "../repo/article.repository";
import { CommentRepository } from "../repo/comment.repository";
import { CommentService } from "../service/comment.service";
import { CommentController } from "../controller/comment.controller";
import { NotificationRepository } from "../repo/notification.repository";
import { NotificationService } from "../service/notification.service";
import { notificationGateway } from "../gateway/notification.gateway";

const productRepository = new ProductRepository();
const articleRepository = new ArticleRepository();
const commentRepository = new CommentRepository();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository, notificationGateway);

const commentService = new CommentService(
  commentRepository,
  productRepository,
  articleRepository,
  notificationService
);

const commentController = new CommentController(commentService);

const router = Router();

router.post(
  "/product/:productId",
  authMiddleware,
  validateComment,
  commentController.createProductComment,
);
router.get("/product/:productId", commentController.getProductComments);
router.patch(
  "/product/:commentId",
  authMiddleware,
  validateComment,
  commentController.updateProductComment,
);
router.delete(
  "/product/:commentId",
  authMiddleware,
  commentController.deleteProductComment,
);

router.post(
  "/article/:articleId",
  authMiddleware,
  validateComment,
  commentController.createArticleComment,
);
router.get("/article/:articleId", commentController.getArticleComments);
router.patch(
  "/article/:commentId",
  authMiddleware,
  validateComment,
  commentController.updateArticleComment,
);
router.delete(
  "/article/:commentId",
  authMiddleware,
  commentController.deleteArticleComment,
);

export default router;
