import { prismaClient } from "../lib/prismaClient.js";
import { BaseController } from "./base.controller.js";
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from "../structs/productsStruct.js";

export class ProductController extends BaseController {
  constructor() {
    super(prismaClient.product, "product");
  }

  async createProduct(req, res) {
    return this.create(req, res, CreateProductBodyStruct);
  }

  async getProduct(req, res) {
    return this.getById(req, res);
  }

  async updateProduct(req, res) {
    return this.update(req, res, UpdateProductBodyStruct);
  }

  async deleteProduct(req, res) {
    return this.delete(req, res);
  }

  async getProductList(req, res) {
    return this.getList(req, res, GetProductListParamsStruct, [
      "name",
      "description",
    ]);
  }
}

// 기존 함수형 export 유지
const productController = new ProductController();

export const createProduct = (req, res) =>
  productController.createProduct(req, res);
export const getProduct = (req, res) => productController.getProduct(req, res);
export const updateProduct = (req, res) =>
  productController.updateProduct(req, res);
export const deleteProduct = (req, res) =>
  productController.deleteProduct(req, res);
export const getProductList = (req, res) =>
  productController.getProductList(req, res);
