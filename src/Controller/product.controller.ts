import { Request, Response, NextFunction } from "express";
import { ProductService } from "../Service/product.service";
import { ProductCreateDto } from "../dto/product.dto";

const productService = new ProductService();

export class ProductController {
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productService.list(req.query, req.user?.id);
      res.status(200).json(products);
    } catch (e) {
      next(e);
    }
  };

  create = async (req: Request<{}, {}, ProductCreateDto>, res: Response, next: NextFunction) => {
    try {
      const product = await productService.create({ ...req.body, userId: req.user!.id });
      res.status(201).json(product);
    } catch (e) {
      next(e);
    }
  };

  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.detail(Number(req.params.id), req.user?.id);
      res.status(200).json(product);
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.update(Number(req.params.id), req.body, req.user!.id);
      res.status(200).json(product);
    } catch (e) {
      next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.remove(Number(req.params.id), req.user!.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  myProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productService.listMyProducts(req.user!.id);
      res.status(200).json(products);
    } catch (e) {
      next(e);
    }
  };

  like = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.like(Number(req.params.id), req.user!.id);
      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  };

  unlike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.unlike(Number(req.params.id), req.user!.id);
      res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  };
}
