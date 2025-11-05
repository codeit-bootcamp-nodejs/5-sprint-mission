import { ProductRepository } from "../Repository/product.repository";
import { ProductCreateDto, ProductResponse } from "../dto/product.dto";

export class ProductService {
  private repo = new ProductRepository();

  async list(query: any, userId?: number): Promise<ProductResponse[]> {
    return this.repo.findMany({
      orderBy: { createdAt: "desc" },
      skip: Number(query.skip) || 0,
      take: Number(query.take) || 10,
    });
  }

  async create(data: ProductCreateDto & { userId: number }): Promise<ProductResponse> {
    return this.repo.create({
      ...data,
      tags: data.tags ?? [],
    });
  }

  async detail(id: number, userId?: number): Promise<ProductResponse | null> {
    return this.repo.findById(id);
  }

  async update(id: number, data: Partial<ProductCreateDto>, userId: number) {
    const product = await this.repo.findById(id);
    if (!product || product.userId !== userId) throw new Error("권한이 없습니다.");
    return this.repo.update(id, data);
  }

  async remove(id: number, userId: number) {
    const product = await this.repo.findById(id);
    if (!product || product.userId !== userId) throw new Error("권한이 없습니다.");
    return this.repo.delete(id);
  }

  async listMyProducts(userId: number) {
    return this.repo.findByUser(userId);
  }

  async like(id: number, userId: number) {
    return { success: true };
  }

  async unlike(id: number, userId: number) {
    return { success: true };
  }
}
