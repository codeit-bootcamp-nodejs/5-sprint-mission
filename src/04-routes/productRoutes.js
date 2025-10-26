import express from "express";
import { authMiddleware } from "../05-middleware/auth.js";

export const productRoutes = (productController) => {
  const router = express.Router();

  router.post("/", authMiddleware, productController.createProduct);
  router.get("/", authMiddleware, productController.getProducts);
  router.post("/:productId/like", authMiddleware, productController.toggleLike);

  return router;
};
