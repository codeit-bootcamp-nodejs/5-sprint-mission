import { IServices } from "../domain/service/services";
import { BaseController, ControllerHandler } from "./base.controller";
import { productLikeReqSchema } from "../requests/product/product.req.schemas";
import { ProductLikeResDto } from "../responses/product/product.like.res.dto";

export class ProductLikeController extends BaseController{

  constructor(services: IServices) {
    super(services);
  }

  addProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(productLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    const product = await this._productService.productLike(reqDto);
    const resDto = new ProductLikeResDto(product);

    return res.json(resDto);
  };
  cancelProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(productLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    const product = await this._productService.cancelProductLike(reqDto);
    const resDto = new ProductLikeResDto(product);

    return res.json(resDto);
  };
}
