import express from "express";
import { withAsync } from "../lib/withAsync";
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from "../controllers/articlesController";

const articlesRouter = express.Router();

articlesRouter.post("/", withAsync(createArticle));
articlesRouter.get("/", withAsync(getArticleList));
articlesRouter.get("/:id", withAsync(getArticle));
articlesRouter.patch("/:id", withAsync(updateArticle));
articlesRouter.delete("/:id", withAsync(deleteArticle));
articlesRouter.post("/:id/comments", withAsync(createComment));
articlesRouter.get("/:id/comments", withAsync(getCommentList));

export default articlesRouter;
