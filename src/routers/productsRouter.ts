import express from "express";
import { withAsync } from "../lib/withAsync";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from "../controllers/productsController";
import { authMiddleware } from "../lib/authMiddleware";

const productsRouter = express.Router();

productsRouter.post("/", authMiddleware, withAsync(createProduct));
productsRouter.get("/:id", withAsync(getProduct));
productsRouter.patch("/:id", withAsync(updateProduct));
productsRouter.delete("/:id", withAsync(deleteProduct));
productsRouter.get("/", withAsync(getProductList));
productsRouter.post("/:id/comments", withAsync(createComment));
productsRouter.get("/:id/comments", withAsync(getCommentList));

export default productsRouter;
