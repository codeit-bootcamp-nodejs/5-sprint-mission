import express from "express";
import { withAsync } from "../lib/withAsync.js";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from "../controllers/productsController.js";

const productsRouter = express.Router();

productsRouter.post("/", withAsync(createProduct));
productsRouter.get("/:id", withAsync(getProduct));
productsRouter.patch("/:id", withAsync(updateProduct));
productsRouter.delete("/:id", withAsync(deleteProduct));
productsRouter.get("/", withAsync(getProductList));
productsRouter.post("/:id/comments", withAsync(createComment));
productsRouter.get("/:id/comments", withAsync(getCommentList));

export default productsRouter;
