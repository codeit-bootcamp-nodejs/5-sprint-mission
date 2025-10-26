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

  async likeProduct(productId, userId) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Exception(404, "존재하지 않는 상품입니다");
    const exists = await this.prisma.productLike.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (exists) throw new Exception(409, "이미 좋아요한 상품입니다");
    await this.prisma.productLike.create({ data: { productId, userId } });
    return { liked: true };
  }

  async unlikeProduct(productId, userId) {
    const exists = await this.prisma.productLike.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (!exists) throw new Exception(404, "좋아요한 내역이 없습니다");
    await this.prisma.productLike.delete({
      where: { productId_userId: { productId, userId } },
    });
    return { liked: false };
  }
}
