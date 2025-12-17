import { BaseController, ControllerHandler } from "./base.controller";
import { productLikeReqSchema } from "../requests/product/product.req.schemas";
import { LikeProductResDto } from "../responses/product/like.product.res.dto";
import { IServices } from "../port/services.interface";
import { UnlikeProductResDto } from "../responses/product/unlike.product.res.dto";

export class ProductLikeController extends BaseController{

  constructor(services: IServices) {
    super(services);
  }

  addProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(productLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    await this._services.product.likeProduct(reqDto);
    const resDto = new LikeProductResDto();

    return res.json(resDto);
  };
  cancelProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(productLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    await this._services.product.unlikeProduct(reqDto);
    const resDto = new UnlikeProductResDto();

    return res.json(resDto);
  };
}
