import express, { Router, Request, Response } from "express";
import { withAsync } from "../../common/lib/withAsync";
import { authMiddleware } from "../../common/lib/auth.middleware";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticleList,
  updateArticle,
} from "../controllers/articles.controller";
import { createComment } from "../controllers/comments.controller";

const articlesRouterCA: Router = express.Router();

articlesRouterCA.post(
  "/",
  authMiddleware,
  withAsync((req: Request, res: Response) => createArticle(req, res)),
);

articlesRouterCA.get(
  "/",
  withAsync((req: Request, res: Response) => getArticleList(req, res)),
);

articlesRouterCA.get(
  "/:id",
  withAsync((req: Request, res: Response) => getArticle(req, res)),
);

articlesRouterCA.patch(
  "/:id",
  authMiddleware,
  withAsync((req: Request, res: Response) => updateArticle(req, res)),
);

articlesRouterCA.delete(
  "/:id",
  authMiddleware,
  withAsync((req: Request, res: Response) => deleteArticle(req, res)),
);

articlesRouterCA.post(
  "/:id/comments",
  authMiddleware,
  withAsync((req: Request, res: Response) => createComment(req, res)),
);

export default articlesRouterCA;
