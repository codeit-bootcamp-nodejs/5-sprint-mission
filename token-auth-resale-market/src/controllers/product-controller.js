import { ProductService } from "../services/product-service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductController {
  constructor() {
    this.productService = new ProductService(prisma);
  }

  createProduct = async (req, res) => {
    const userId = req.user.userId;
    const productData = { ...req.body, userId: userId };
    const product = await this.productService.postProduct(productData);
    res.status(201).json({ message: "상품이 등록되었습니다", data: product });
  };

  getProducts = async (req, res) => {
    const products = await this.productService.getProducts(req.query);
    res.status(200).json({ message: "상품 목록 조회 성공", data: products });
  };

  getProductDetail = async (req, res) => {
    const productId = parseInt(req.params.id);
    const product = await this.productService.getProductDetail(productId);
    res.status(200).json({ message: "상품 상세 조회 성공", data: product });
  };

  updateProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = await this.productService.editProduct(
      productId,
      req.body,
    );
    res.json(updatedProduct);
  };

  deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    await this.productService.deleteProduct(productId);

    res.json(updatedProduct);

  };

  likeProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const userId = req.user.userId;
    const result = await this.productService.likeProduct(productId, userId);
    res.json(result);
  };

  unlikeProduct = async (req, res) => {
    const productId = parseInt(req.params.id);
    const userId = req.user.userId;
    const result = await this.productService.unlikeProduct(productId, userId);
    res.json(result);
  };
}
