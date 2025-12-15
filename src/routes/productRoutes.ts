import { Router } from "express";
import { ProductController } from "../controller/productController";

export const productRoutesFactory = (productController: ProductController) => {
  const router = Router();

  // 상품 생성
  router.post("/", productController.createProduct);
  // 상품 목록 조회
  router.get("/", productController.getProducts);
  // 좋아요 토글
  router.post("/:productId/like", productController.toggleLike);

  return router;
};