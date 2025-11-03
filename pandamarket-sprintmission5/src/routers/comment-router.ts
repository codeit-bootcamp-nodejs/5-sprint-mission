import express from "express";
import { Controller } from "../controllers/controller";
import authenticate from "../middlewares/authenticate";
import { withAsync } from "../lib/withAsync";

const commentRouter = express.Router();

commentRouter.post(
  "/product/:productId/comment",
  authenticate({ optional: false }),
  withAsync(Controller.comment.handlerCreateProductComment)
);

commentRouter.post(
  "/article/:articleId/comment",
  authenticate({ optional: false }),
  withAsync(Controller.comment.handlerCreateArticleComment)
);

commentRouter.patch(
  "/comment/:id",
  authenticate({ optional: false }),
  withAsync(Controller.comment.handlerUpdateComment)
);

commentRouter.delete(
  "/comment/:id",
  authenticate({ optional: false }),
  withAsync(Controller.comment.handlerDeleteComment)
);

commentRouter.get(
  "/product/:productId/comments",
  withAsync(Controller.comment.handlerGetProductComments)
);

commentRouter.get(
  "/article/:articleId/comments",
  withAsync(Controller.comment.handlerGetArticleComments)
);

export default commentRouter;