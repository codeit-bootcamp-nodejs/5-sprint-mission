import express from 'express';
import * as articleController from '../controllers/articleController.js';
import { errorHandler } from '../middleware/error.js';

const router = express.Router();

router
  .route('/')
  .get(articleController.list)
  .post(articleController.create);

router
  .route('/:id')
  .get(articleController.detail)
  .patch(articleController.update)
  .delete(articleController.remove);

router.use(errorHandler);

export default router;
