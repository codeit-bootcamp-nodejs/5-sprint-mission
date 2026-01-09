import { BaseController, ControllerHandler } from "./base.controller";
import {
  createProductReqSchema,
  deleteProductReqSchema,
  getProductListReqSchema,
  getProductReqSchema,
  updateProductReqSchema,
} from "../requests/product/product.req.schemas";
import { CreateProductResDto } from "../responses/product/create.product.res.dto";
import { GetProductListResDto } from "../responses/product/get.product.list.res.dto";
import { GetProductResDto } from "../responses/product/get.product.res.dto";
import { UpdateProductResDto } from "../responses/product/update.product.res.dto";
import { ProductCommandService } from "../../application/command/service/product/product.command.service";

export class ProductController extends BaseController {
  constructor(
    private readonly _productCommandService: ProductCommandService
  ) {
    super();
  }

  createProductController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      createProductReqSchema.safeParse({
        userId: req.userId,
        ...req.body,
      }),
    );

    const createdProduct = await this._productCommandService.createProduct(reqDto);
    const createdProductResDto = new CreateProductResDto(createdProduct);
    return res.json(createdProductResDto);
  };

  getProductController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      getProductReqSchema.safeParse(req.params),
    );
    const getProduct = await this._productCommandService.getProduct(reqDto);
    const getProductResDto = new GetProductResDto(getProduct);
    return res.json(getProductResDto);
  };

  getProductListController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      getProductListReqSchema.safeParse(req.query ?? {}),
    );
    // // // const getProductList = await this._productCommandService.getProductList(reqDto);
    // // const getProductListResDto = new GetProductListResDto(getProductList);
    // return res.json(getProductListResDto);
    return res.sendStatus(200);
  };

  updateProductController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      updateProductReqSchema.safeParse({
        userId: req.userId,
        ...req.body,
        ...req.params,
      }),
    );
    const updatedProduct = await this._productCommandService.updateProduct(reqDto);
    const updatedProductResDto = new UpdateProductResDto(updatedProduct);
    return res.json(updatedProductResDto);
  };

  deleteProductController: ControllerHandler = async (req, res, next) => {
    const reqDto = this.validateOrThrow(
      deleteProductReqSchema.safeParse({
        userId: req.userId,
        ...req.params,
      }),
    );
    const deletedwProduct = await this._productCommandService.deleteProduct(reqDto);
    return res.sendStatus(200);
  };
}
