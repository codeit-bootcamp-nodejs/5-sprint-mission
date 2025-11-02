import express from "express";
import { Controller } from "../controllers/controller";
import authenticate from "../middlewares/authenticate";
import { withAsync } from "../lib/withAsync";

const articleRouter = express.Router();

articleRouter.post(
  "/article",
  authenticate({ optional: false }),
  withAsync(Controller.article.handlerCreateArticle)
);
articleRouter.get(
  "/article",
  authenticate({ optional: true }),
  withAsync(Controller.article.handlerGetArticles)
);
articleRouter.get(
  "/article/:id",
  authenticate({ optional: true }),
  withAsync(Controller.article.handlerGetArticleDetail)
);
articleRouter.patch(
  "/article/:id",
  authenticate({ optional: false }),
  withAsync(Controller.article.handlerUpdateArticle)
);
articleRouter.delete(
  "/article/:id",
  authenticate({ optional: false }),
  withAsync(Controller.article.handlerDeleteArticle)
);
articleRouter.post(
  "/article/:id/like",
  authenticate({ optional: false }),
  withAsync(Controller.article.handlerLikeArticle)
);
articleRouter.patch(
  "/article/:id/like",
  authenticate({ optional: false }),
  withAsync(Controller.article.handlerUnlikeArticle)
);
articleRouter.get(
  "/article/me",
  authenticate({ optional: false }),
  withAsync(Controller.article.handlerGetMyArticles)
);
articleRouter.get(
    "/article/favorites/me",
    authenticate({ optional: false }),
    withAsync(Controller.article.handlerGetMyFavoriteArticles)
);

export default articleRouter;