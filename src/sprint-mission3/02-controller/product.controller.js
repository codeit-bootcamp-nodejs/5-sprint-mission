import { BaseContolloer } from "./base.controller.js";
import { ProductReqValidator } from "./req.validator/product.req.validator.js";
import { CreateProductResDto } from "./res.Dto/product/create.product.res.Dto.js";

export class ProductController extends BaseContolloer {
  #productService;

  constructor(productService) {
    super("/api/product");
    this.#productService = productService;
    this.registerRouter();
  }

  registerRouter = () => {
    this.router.post(
      "/create",
      this.catchException(this.createProductMiddleware) ,
    );
  };

  createProductMiddleware = async (req, res, next) => {
    const createProductReqDto = new ProductReqValidator({ body: req.body }).validate();
    const createdProduct = await this.#productService.createProduct(createProductReqDto);
    const createdProductResDto = new CreateProductResDto(createdProduct);  
    return res.json(createdProductResDto);
  };
}
