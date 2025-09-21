import { Router } from "express";
import { ArticleController } from "../02-controller/article.controller.js";
import { validateArticleCreate } from "../05-middleware/validate.middleware.js";

const router = Router();
const controller = new ArticleController();

router
  .route('/articles')
  .get(controller.list)
  .post(validateArticleCreate, controller.create);

router
  .route('/articles/:id')
  .get(controller.detail) 
  .patch(controller.update)
  .delete(controller.remove);

export default router;
