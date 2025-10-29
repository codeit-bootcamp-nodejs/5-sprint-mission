import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { registerUser, loginUser, refreshToken } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', withAsync(registerUser));
userRouter.post('/login', withAsync(loginUser));
userRouter.post('/refresh-token', withAsync(refreshToken));

export default userRouter;
