import { ProductRepository } from "../repositories/product-repository.js";

export class ProductService {
  constructor(prisma) {
    this.productRepository = new ProductRepository(prisma);
  }

  async postProduct(productData) {
    if (!productData.name || !productData.price) {
      throw new Error("상품명과 가격은 필수입니다.");
    }

    const product = await this.productRepository.post(productData);
    return product;
  }

  async getProducts(query) {
    const products = await this.productRepository.load(query);
    return products;
  }

  async getProductDetail(productId) {
    const product = await this.productRepository.loadDetail(productId);
    if (!product) throw new Error("존재하지 않는 상품입니다.");
    return product;
  }

  async editProduct(productId, productData) {
    const existing = await this.productRepository.loadDetail(productId);
    if (!existing) throw new Error("존재하지 않는 상품입니다.");

    const updated = await this.productRepository.edit(productId, productData);
    return updated;
  }

  async deleteProduct(productId) {
    const existing = await this.productRepository.loadDetail(productId);
    if (!existing) throw new Error("존재하지 않는 상품입니다.");

    await this.productRepository.delete(productId);
    return true;
  }
}
