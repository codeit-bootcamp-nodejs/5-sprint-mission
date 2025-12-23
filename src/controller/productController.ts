import { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/productService";

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  // 상품 생성
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, description } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const product = await this.productService.createProduct({
        name,
        price,
        description,
        userId,
      });
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  };

  // 상품 목록 조회
  getProducts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getProducts();
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  // 좋아요 토글
  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.productId;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.productService.toggleLike(productId, userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
