import express from 'express';
import { authMiddleware } from '../lib/authMiddleware.js';
import {
  getMyInfo,
  updateMyInfo,
  changeMyPassword,
  getMyProducts,
} from '../controllers/userInfoController.js';
import { withAsync } from '../lib/withAsync.js';

const userInfoRouter = express.Router();

userInfoRouter.get('/me', authMiddleware, withAsync(getMyInfo));
userInfoRouter.patch('/me', authMiddleware, withAsync(updateMyInfo));
userInfoRouter.patch('/me/password', authMiddleware, withAsync(changeMyPassword));
userInfoRouter.get('/me/products', authMiddleware, withAsync(getMyProducts));

export default userInfoRouter;
