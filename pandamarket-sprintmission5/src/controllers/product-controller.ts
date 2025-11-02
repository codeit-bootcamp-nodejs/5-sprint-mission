import { IService } from "../domain/service";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export interface IProductController {
  handlerUploadProduct: (req: Request, res: Response) => Promise<void>;
  handlerGetAllProducts: (req: Request, res: Response) => Promise<void>;
  handlerGetProductDetail: (req: Request, res: Response) => Promise<void>;
  handlerUpdateProduct: (req: Request, res: Response) => Promise<void>;
  handlerDeleteProduct: (req: Request, res: Response) => Promise<void>;
  handlerLikeProduct: (req: Request, res: Response) => Promise<void>;
  handlerUnlikeProduct: (req: Request, res: Response) => Promise<void>;
  handlerGetMyProducts: (req: Request, res: Response) => Promise<void>;
}

export class ProductController
  extends BaseController
  implements IProductController {
  constructor(service: IService) {
    super(service);
  }

  handlerUploadProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }
    const product = await this.service.product.uploadProduct(req.body, userId);
    res.status(200).json({ message: "상품이 등록되었습니다", data: product });
  };

  handlerGetAllProducts = async (req: Request, res: Response) => {
    const products = await this.service.product.getProducts(req.query);
    res.status(200).json({ message: "전체 상품 목록 조회 성공", data: products });
  };

  handlerGetProductDetail = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }
    const product = await this.service.product.getProductDetail(productId);
    res.status(200).json({ message: "상품 상세 조회 성공", data: product });
  };

  handlerUpdateProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }

    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }
    const updatedProduct = await this.service.product.editProduct(
      productId,
      userId,
      req.body,
    );
    res.json(updatedProduct);
  };

  handlerDeleteProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }

    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }

    await this.service.product.deleteProduct(productId);

    res.status(200).json({ message: "상품 삭제 성공" });
  };

  handlerLikeProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }

    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }

    const result = await this.service.product.likeProduct(productId, userId);

    res.status(200).json();
  };

  handlerUnlikeProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }

    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      throw new Error("유효하지 않은 상품 ID입니다.");
    }
    const result = await this.service.product.unlikeProduct(
      productId,
      userId,
    );
    res.status(200).json(result);
  };

  handlerGetMyProducts = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (userId === undefined || userId === null) {
      throw new Error("인증된 사용자 ID를 찾을 수 없습니다.");
    }
    const query = req.query;
    const products = await this.service.product.getMyProducts(userId, query);

    res.status(200).json(products);
  };
}
