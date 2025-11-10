import { Router } from "express";
import { ArticleController } from "../Controller/article.controller";
import { requireAuth, optionalAuth } from "../Middleware/auth.middleware";
import { validateArticleCreate } from "../Middleware/validate.middleware";

const router = Router();
const controller = new ArticleController();

router
  .route("/articles")
  .get(optionalAuth, controller.list)
  .post(requireAuth, validateArticleCreate, controller.create);

router
  .route("/articles/:id")
  .get(optionalAuth, controller.detail)
  .patch(requireAuth, controller.update)
  .delete(requireAuth, controller.remove);

router.post("/articles/:id/like", requireAuth, controller.like);
router.delete("/articles/:id/like", requireAuth, controller.unlike);

export default router;
