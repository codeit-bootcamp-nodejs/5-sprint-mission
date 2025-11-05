import express from "express";
import { withAsync } from "../lib/withAsync";
import { authMiddleware } from "../lib/authMiddleware";
import {
  likeArticle,
  unlikeArticle,
  likeProduct,
  unlikeProduct,
} from "../controllers/likeController";

const likeRouter = express.Router();

likeRouter.post("/articles/:id", authMiddleware, withAsync(likeArticle));
likeRouter.delete("/articles/:id", authMiddleware, withAsync(unlikeArticle));
likeRouter.post("/products/:id", authMiddleware, withAsync(likeProduct));
likeRouter.delete("/products/:id", authMiddleware, withAsync(unlikeProduct));

export default likeRouter;
