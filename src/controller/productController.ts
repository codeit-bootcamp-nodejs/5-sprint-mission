import type { Request, Response, NextFunction } from "express";
import { CreateProductDTO } from "../common/dto";
import type { ProductService } from "../service/productService";

export class ProductController {
  #productService: ProductService;
  constructor(productService: ProductService) { this.#productService = productService; }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const payload = req.body as CreateProductDTO;
      const product = await this.#productService.createProduct(userId, payload);
      res.status(201).json(product);
    } catch (err) { next(err); }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id ?? null;
      const products = await this.#productService.getProducts(userId);
      res.status(200).json(products);
    } catch (err) { next(err); }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { productId } = req.params;
      const like = await this.#productService.toggleLike(userId, productId);
      res.status(200).json(like);
    } catch (err) { next(err); }
  };
}
