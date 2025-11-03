import { create } from "superstruct";
import { IService } from "../domain/service";
import BadRequestError from "../lib/errors/BadRequestError";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import { CreateProductBodyStruct } from "../structs/products-struct";
import { IdParamsStruct } from "../structs/common-structs";

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
    const data = create(req.body, CreateProductBodyStruct);
    const product = await this.service.product.uploadProduct(req.body, userId);
    res.status(200).json({ message: "상품이 등록되었습니다", data: product });
  };

  handlerGetAllProducts = async (req: Request, res: Response) => {
    const products = await this.service.product.getProducts(req.query);
    res.status(200).json({ message: "전체 상품 목록 조회 성공", data: products });
  };

  handlerGetProductDetail = async (req: Request, res: Response) => {
    const { id } = create(req.params, IdParamsStruct);
    const product = await this.service.product.getProductDetail(id);
    res.status(200).json({ message: "상품 상세 조회 성공", data: product });
  };

  handlerUpdateProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = create(req.params, IdParamsStruct);
    const updatedProduct = await this.service.product.editProduct(
      id,
      userId,
      req.body,
    );
    res.json(updatedProduct);
  };

  handlerDeleteProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = create(req.params, IdParamsStruct);
    await this.service.product.deleteProduct(id);

    res.status(200).json({ message: "상품 삭제 성공" });
  };

  handlerLikeProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = create(req.params, IdParamsStruct);
    await this.service.product.likeProduct(id, userId);

    res.status(200).json();
  };

  handlerUnlikeProduct = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = create(req.params, IdParamsStruct);
    await this.service.product.unlikeProduct(
      id,
      userId,
    );
    res.status(200).json();
  };

  handlerGetMyProducts = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const query = req.query;
    const products = await this.service.product.getMyProducts(userId, query);

    res.status(200).json(products);
  };
}
