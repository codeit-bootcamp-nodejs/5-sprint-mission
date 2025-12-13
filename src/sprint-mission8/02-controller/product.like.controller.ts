import { IServices } from "../domain/service/services";
import { BaseController, ControllerHandler } from "./base.controller";
import { productLikeReqSchema } from "./req.validator/product/product.req.schemas";
import { ProductLikeResDto } from "./res.dto/product/product.like.res.dto";
export interface IProductLikeController {
  addProductLikeController: ControllerHandler;
  cancelProductLikeController: ControllerHandler;
}
export class ProductLikeController extends BaseController implements IProductLikeController {

  constructor(services: IServices) {
    super(services);
  }

  addProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(productLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    const product = await this._productService.addProductLike(reqDto);
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
