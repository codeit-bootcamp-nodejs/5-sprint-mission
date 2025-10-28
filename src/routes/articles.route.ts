import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middlewares/auth";
import { parseIdParam } from "../middlewares/params";
import {
  validateCreateArticle,
  validateUpdateArticle,
} from "../middlewares/validator";
import * as article from "../controllers/article.controller";

const router = Router();
router.get("/mine", authenticate, article.mine);

router
  .route("/")
  .get(optionalAuthenticate, article.list)
  .post(authenticate, validateCreateArticle, article.create);

router
  .route("/:id")
  .get(optionalAuthenticate, parseIdParam(), article.getOne)
  .patch(authenticate, parseIdParam(), validateUpdateArticle, article.update)
  .delete(authenticate, parseIdParam(), article.remove);

router.post("/:id/like", authenticate, parseIdParam(), article.like);
router.delete("/:id/like", authenticate, parseIdParam(), article.unlike);
export default router;
