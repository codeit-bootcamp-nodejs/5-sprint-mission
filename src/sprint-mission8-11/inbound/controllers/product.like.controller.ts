import { BaseController, ControllerHandler } from "./base.controller";
import { productLikeReqSchema } from "../requests/product/product.req.schemas";
import { ProductCommandService } from "../../application/command/service/product/product.command.service";

export class ProductLikeController extends BaseController {
  constructor(private readonly _productService: ProductCommandService) {
    super();
  }

  addProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      productLikeReqSchema.safeParse({
        userId: req.userId,
        ...req.params,
      }),
    );

    await this._productService.likeProduct(reqDto);
    return res.sendStatus(200);
  };
  cancelProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      productLikeReqSchema.safeParse({
        userId: req.userId,
        ...req.params,
      }),
    );

    await this._productService.unlikeProduct(reqDto);
    return res.sendStatus(200);
  };
}
