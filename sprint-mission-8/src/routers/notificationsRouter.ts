import express from 'express';
import authenticate from '../middlewares/authenticate';
import { withAsync } from '../lib/withAsync';
import { readNotification } from '../controllers/notificationsController';

export const notificationsRouter = express.Router();

notificationsRouter.patch('/:id/read', authenticate(), withAsync(readNotification));
