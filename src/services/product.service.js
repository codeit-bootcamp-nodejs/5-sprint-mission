import axios from "../lib/axios.js";
import { BaseService } from "./base.service.js";

class ProductService extends BaseService {
  constructor() {
    super(axios, "", "products");
  }
}

// 기존 함수형 인터페이스 유지를 위한 인스턴스 생성
const productService = new ProductService();

export async function getProductList(params) {
  return productService.getList(params);
}

export async function getProduct(productId) {
  return productService.getById(productId);
}

export async function createProduct(data) {
  return productService.create(data);
}

export async function patchProduct(productId, data) {
  return productService.update(productId, data);
}

export async function deleteProduct(productId) {
  return productService.delete(productId);
}
