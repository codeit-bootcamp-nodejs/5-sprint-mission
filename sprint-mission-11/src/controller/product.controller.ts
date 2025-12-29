import { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/product.service";
import { HttpError } from "../middlewares/error.handler";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductListQueryDto,
} from "../dto/product.dto";

export class ProductController {
  private productService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data: CreateProductDto = req.body;

      const newProduct = await this.productService.createProduct(userId, data);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      const {
        offset: offsetQuery,
        limit: limitQuery,
        keyword: keywordQuery,
        sort: sortQuery,
      } = req.query;

      const offset = Number(offsetQuery) || 0;
      const limit = Number(limitQuery) || 10;
      const keyword = String(keywordQuery || "");

      const sort: "recent" | "asc" = sortQuery === "asc" ? "asc" : "recent";

      const queryDto: ProductListQueryDto = {
        offset,
        limit,
        keyword,
        sort,
      };

      const products = await this.productService.getProducts(queryDto, userId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      const product = await this.productService.getProductById(
        productId,
        userId,
      );
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.id);
      const data: UpdateProductDto = req.body;

      if (isNaN(productId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      const updatedProduct = await this.productService.updateProduct(
        productId,
        userId,
        data,
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      await this.productService.deleteProduct(productId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleProductLike = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.id;
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
        throw new HttpError(400, "유효하지 않은 ID입니다.");
      }

      const result = await this.productService.toggleProductLike(
        productId,
        userId,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
