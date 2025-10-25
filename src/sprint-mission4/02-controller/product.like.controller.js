import { ProductLikeReqValidator } from "./req.validator/product/product.like.req.validator.js";
import { GetProductListResDto } from "./res.dto/product/get.product.list.res.dto.js";
import { ProductLikeResDto } from "./res.dto/product/product.like.res.dto.js";

export class ProductLikeController {
  #services;

  constructor(services) {
    this.#services = services;
  }

  addProductLikeController = async (req, res, next) => {
    const reqDto = new ProductLikeReqValidator({
      userId: req.userId,
      params: req.params,
    }).validate();

    const product = await this.#services.product.addProductLike(reqDto);
    const resDto = new ProductLikeResDto(product);

    return res.json(resDto);
  };
  cancelProductLikeController = async (req, res, next) => {
    const reqDto = new ProductLikeReqValidator({
      userId: req.userId,
      params: req.params,
    }).validate();

    const product = await this.#services.product.cancelProductLike(reqDto);
    const resDto = new ProductLikeResDto(product);

    return res.json(resDto);
  };
}
