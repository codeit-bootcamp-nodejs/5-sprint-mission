import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { errorHandler } from '../middleware/error.js';

const router = express.Router();

router
  .route('/products/:productId/comments')
  .get(commentController.listProductComments)
  .post(commentController.createProductComment);

router
  .route('/articles/:articleId/comments')
  .get(commentController.listArticleComments)
  .post(commentController.createArticleComment);

router
  .route('/comments/:id')
  .patch(commentController.update)
  .delete(commentController.remove);

router.use(errorHandler);

export default router;
