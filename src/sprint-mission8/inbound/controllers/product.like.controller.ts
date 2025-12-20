import { BaseController, ControllerHandler } from "./base.controller";
import { productLikeReqSchema } from "../requests/product/product.req.schemas";
import { LikeProductResDto } from "../responses/product/like.product.res.dto";
import { UnlikeProductResDto } from "../responses/product/unlike.product.res.dto";
import { ProductService } from "../../domain/service/product/product.service";

export class ProductLikeController extends BaseController {

  constructor(
    private readonly _productService: ProductService
  ) {
    super();
  }

  addProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(productLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    await this._productService.likeProduct(reqDto);
    const resDto = new LikeProductResDto();

    return res.json(resDto);
  };
  cancelProductLikeController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(productLikeReqSchema.safeParse({
      userId: req.userId,
      ...req.params,
    }));

    await this._productService.unlikeProduct(reqDto);
    const resDto = new UnlikeProductResDto();

    return res.json(resDto);
  };
}
