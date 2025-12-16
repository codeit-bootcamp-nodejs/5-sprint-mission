import express, { Router, Request, Response } from "express";
import { withAsync } from "../../common/lib/withAsync";
import { authMiddleware } from "../../common/lib/auth.middleware";
import {
  updateComment,
  deleteComment,
} from "../controllers/comments.controller";

const commentsRouterCA: Router = express.Router();

commentsRouterCA.patch(
  "/:id",
  authMiddleware,
  withAsync((req: Request, res: Response) => updateComment(req, res)),
);

commentsRouterCA.delete(
  "/:id",
  authMiddleware,
  withAsync((req: Request, res: Response) => deleteComment(req, res)),
);

export default commentsRouterCA;
