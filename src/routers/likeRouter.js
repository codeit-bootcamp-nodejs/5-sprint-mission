import express from 'express';
import { authMiddleware } from '../lib/authMiddleware.js';
import {
  likeArticle,
  unlikeArticle,
  likeProduct,
  unlikeProduct,
} from '../controllers/likeController.js';
import { withAsync } from '../lib/withAsync.js';

const likeRouter = express.Router();

likeRouter.post('/articles/:id/like', authMiddleware, withAsync(likeArticle));
likeRouter.delete('/articles/:id/like', authMiddleware, withAsync(unlikeArticle));
likeRouter.post('/products/:id/like', authMiddleware, withAsync(likeProduct));
likeRouter.delete('/products/:id/like', authMiddleware, withAsync(unlikeProduct));

export default likeRouter;
