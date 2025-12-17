import { BaseController } from "./base-controller";
import { Request, Response } from "express";
import { CreateProductBodyStruct } from "../structs/products-struct";
import { IdParamsStruct } from "../structs/common-structs";
import { IService } from "../../domain/service";
import { IProductController } from "../controller";
import { Middlewares } from "../middlewares";
import { IConfigUtil } from "../../shared/config";
import { mapProduct } from "../mappers/product-mapper";
import { emitNotificationToUser } from "../ws/ws-emitter";

export class ProductController
  extends BaseController
  implements IProductController
{
  constructor(
    middlewares: Middlewares,
    service: IService,
    configUtils: IConfigUtil,
  ) {
    super("/product", middlewares, service, configUtils);
    this.register();
  }

  register() {
    this.router.post(
      "/",
      this.middlewares.auth({ optional: false }),
      this.catch(this.uploadProduct),
    );
    this.router.get(
      "/",
      this.middlewares.auth({ optional: true }),
      this.catch(this.getAllProducts),
    );
    this.router.get(
      "/:id",
      this.middlewares.auth({ optional: false }),
      this.catch(this.getProductDetail),
    );
    this.router.patch(
      "/:id",
      this.middlewares.auth({ optional: false }),
      this.catch(this.updateProduct),
    );
    this.router.delete(
      "/:id",
      this.middlewares.auth({ optional: false }),
      this.catch(this.deleteProduct),
    );
    this.router.post(
      "/:id/favorite",
      this.middlewares.auth({ optional: false }),
      this.catch(this.favoriteProduct),
    );
    this.router.patch(
      "/:id/favorite",
      this.middlewares.auth({ optional: false }),
      this.catch(this.unfavoriteProduct),
    );
    this.router.get(
      "/me",
      this.middlewares.auth({ optional: false }),
      this.catch(this.getMyProducts),
    );
  }

  uploadProduct = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = this.validate(CreateProductBodyStruct, req.body);
    const product = await this.service.product.uploadProduct(data, userId);
    res
      .status(200)
      .json({ message: "상품이 등록되었습니다", data: mapProduct(product) });
  };

  getAllProducts = async (req: Request, res: Response) => {
    const products = await this.service.product.getProducts(req.query);
    res.status(200).json({
      message: "전체 상품 목록 조회 성공",
      data: products.map(mapProduct),
    });
  };

  getProductDetail = async (req: Request, res: Response) => {
    const { id } = this.validate(IdParamsStruct, req.params);
    const product = await this.service.product.getProductDetail(id);
    res
      .status(200)
      .json({ message: "상품 상세 조회 성공", data: mapProduct(product) });
  };

  updateProduct = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = this.validate(IdParamsStruct, req.params);
    const updatedProduct = await this.service.product.editProduct(
      id,
      userId,
      req.body,
    );
    updatedProduct.notifications.forEach((noti) => {
      emitNotificationToUser(noti.userId!, noti);
    });

    res.json(mapProduct(updatedProduct.product));
  };

  deleteProduct = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = this.validate(IdParamsStruct, req.params);
    await this.service.product.deleteProduct(id);

    res.status(200).json({ message: "상품 삭제 성공" });
  };

  favoriteProduct = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = this.validate(IdParamsStruct, req.params);
    await this.service.product.favoriteProduct(id, userId);

    res.status(200).json();
  };

  unfavoriteProduct = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = this.validate(IdParamsStruct, req.params);
    await this.service.product.unfavoriteProduct(id, userId);
    res.status(200).json();
  };

  getMyProducts = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const query = req.query;
    const products = await this.service.product.getMyProducts(userId, query);

    res.status(200).json(products.map(mapProduct));
  };
}
