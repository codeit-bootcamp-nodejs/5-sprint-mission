import express from "express";
import { withAsync } from "../../common/lib/withAsync";
import { authMiddleware } from "../../common/lib/auth.middleware";
import {
  likeArticle,
  unlikeArticle,
  likeProduct,
  unlikeProduct,
} from "../controllers/like.controller";

const likeRouter = express.Router();

likeRouter.post("/articles/:id", authMiddleware, withAsync(likeArticle));
likeRouter.delete("/articles/:id", authMiddleware, withAsync(unlikeArticle));
likeRouter.post("/products/:id", authMiddleware, withAsync(likeProduct));
likeRouter.delete("/products/:id", authMiddleware, withAsync(unlikeProduct));

export default likeRouter;
