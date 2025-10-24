import { CreateProductReqValidator } from "./req.validator/product/create.product.req.validator.js";
import { DeleteProductReqValidator } from "./req.validator/product/delete.product.req.validator.js";
import { UpdateProductReqValidator } from "./req.validator/product/update.product.req.validator.js";
import { ViewProductListReqValidator } from "./req.validator/product/view.product.list.req.validator.js";
import { ViewProductReqValidator } from "./req.validator/product/view.product.req.validator.js";
import { CreateProductResDto } from "./res.dto/product/create.product.res.dto.js";
import { DeleteProductResDto } from "./res.dto/product/delete.product.res.dto.js";
import { UpdateProductResDto } from "./res.dto/product/update.product.res.dto.js";
import { ViewProductListResDto } from "./res.dto/product/view.product.list.res.dto.js";
import { ViewProductResDto } from "./res.dto/product/view.product.res.dto.js";

export class ProductController {
  #services;

  constructor(services) {
    this.#services = services;
  }

  createProductController = async (req, res, next) => {
    const createProductReqDto = new CreateProductReqValidator({
      body: req.body,
    }).validate();
    const createdProduct =
      await this.#services.product.createProduct(createProductReqDto);
    const createdProductResDto = new CreateProductResDto(createdProduct);
    return res.json(createdProductResDto);
  };

  viewProductController = async (req, res, next) => {
    const viewProductReqDto = new ViewProductReqValidator({
      params: req.params,
    }).validate();
    const viewProduct =
      await this.#services.product.viewProduct(viewProductReqDto);
    const viewProductResDto = new ViewProductResDto(viewProduct);
    return res.json(viewProductResDto);
  };

  viewProductListController = async (req, res, next) => {
    const viewProductListReqDto = new ViewProductListReqValidator({
      query: req.query,
    }).validate();
    const viewProductList = await this.#services.product.viewProductList(
      viewProductListReqDto,
    );
    const viewProductListResDto = new ViewProductListResDto(viewProductList);
    return res.json(viewProductListResDto);
  };

  updateProductController = async (req, res, next) => {
    const updateProductReqDto = new UpdateProductReqValidator({
      body: req.body,
      params: req.params,
    }).validate();
    const updatedProduct =
      await this.#services.product.updateProduct(updateProductReqDto);
    const updatedProductResDto = new UpdateProductResDto(updatedProduct);
    return res.json(updatedProductResDto);
  };

  deleteProductController = async (req, res, next) => {
    const deleteProductReqDto = new DeleteProductReqValidator({
      body: req.body,
      params: req.params,
    }).validate();
    const deletedwProduct =
      await this.#services.product.deleteProduct(deleteProductReqDto);
    const deletedProductResDto = new DeleteProductResDto(deletedwProduct);
    return res.json(deletedProductResDto);
  };
}
