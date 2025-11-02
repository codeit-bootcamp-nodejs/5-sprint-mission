import type { PrismaClient } from "@prisma/client";
import { CreateProductDTO } from "../common/dto";

export class ProductService {
  #prisma: PrismaClient;
  constructor(prisma: PrismaClient) { this.#prisma = prisma; }

  async createProduct(userId: string, data: CreateProductDTO) {
    const images = (data.images ?? []).map(url => ({ url }));
    return this.#prisma.product.create({
      data: { ...data, userId, images: { create: images } },
      include: { images: true, likes: true }
    });
  }

  async getProducts(userId: string | null) {
    const items = await this.#prisma.product.findMany({
      include: { images: true, likes: true },
      orderBy: { createdAt: "desc" }
    });

    return items.map(p => ({
      ...p,
      thumbnail: p.images[0]?.url ?? null,
      isLiked: !!(userId && p.likes.some(l => l.userId === userId && l.isLiked))
    }));
  }

  async toggleLike(userId: string, productId: string) {
    const like = await this.#prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (like) {
      return this.#prisma.productLike.update({
        where: { userId_productId: { userId, productId } },
        data: { isLiked: !like.isLiked }
      });
    }

    return this.#prisma.productLike.create({
      data: { userId, productId }
    });
  }
}
