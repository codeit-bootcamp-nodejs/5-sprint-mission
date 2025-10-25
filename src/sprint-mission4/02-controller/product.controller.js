import { CreateProductReqValidator } from "./req.validator/product/create.product.req.validator.js";
import { DeleteProductReqValidator } from "./req.validator/product/delete.product.req.validator.js";
import { UpdateProductReqValidator } from "./req.validator/product/update.product.req.validator.js";
import { GetProductListReqValidator } from "./req.validator/product/get.product.list.req.validator.js";
import { GetProductReqValidator } from "./req.validator/product/get.product.req.validator.js";
import { CreateProductResDto } from "./res.dto/product/create.product.res.dto.js";
import { DeleteProductResDto } from "./res.dto/product/delete.product.res.dto.js";
import { UpdateProductResDto } from "./res.dto/product/update.product.res.dto.js";
import { GetProductListResDto } from "./res.dto/product/get.product.list.res.dto.js";
import { GetProductResDto } from "./res.dto/product/get.product.res.dto.js";

export class ProductController {
  #services;

  constructor(services) {
    this.#services = services;
  }

  createProductController = async (req, res, next) => {
    const createProductReqDto = new CreateProductReqValidator({
      userId: req.userId,
      body: req.body,
    }).validate();
    const createdProduct =
      await this.#services.product.createProduct(createProductReqDto);
    const createdProductResDto = new CreateProductResDto(createdProduct);
    return res.json(createdProductResDto);
  };

  getProductController = async (req, res, next) => {
    const getProductReqDto = new GetProductReqValidator({
      params: req.params,
    }).validate();
    const getProduct =
      await this.#services.product.getProduct(getProductReqDto);
    const getProductResDto = new GetProductResDto(getProduct);
    return res.json(getProductResDto);
  };

  getProductListController = async (req, res, next) => {
    const getProductListReqDto = new GetProductListReqValidator({
      query: req.query,
    }).validate();
    const getProductList =
      await this.#services.product.getProductList(getProductListReqDto);
    const getProductListResDto = new GetProductListResDto(getProductList);
    return res.json(getProductListResDto);
  };

  updateProductController = async (req, res, next) => {
    const updateProductReqDto = new UpdateProductReqValidator({
      userId: req.userId,
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
      userId: req.userId,
      params: req.params,
    }).validate();
    const deletedwProduct =
      await this.#services.product.deleteProduct(deleteProductReqDto);
    const deletedProductResDto = new DeleteProductResDto(deletedwProduct);
    return res.json(deletedProductResDto);
  };
}
