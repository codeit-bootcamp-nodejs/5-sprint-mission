import express, { Router } from "express";
import { authMiddleware } from "../middelware/auth";

export const productRoutesFactory = (productController: any): Router => {
  const router = express.Router();

  router.post("/", authMiddleware, productController.createProduct);
  router.get("/", authMiddleware, productController.getProducts);
  router.post("/:productId/like", authMiddleware, productController.toggleLike);

  return router;
};
