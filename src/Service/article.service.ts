import { ArticleRepository } from "../Repository/article.repository";
import { ArticleCreateDto, ArticleResponse } from "../dto/article.dto";

export class ArticleService {
  private repo = new ArticleRepository();

  async list(query: any, userId?: number): Promise<ArticleResponse[]> {
    return this.repo.findMany({
      orderBy: { createdAt: "desc" },
      skip: Number(query.skip) || 0,
      take: Number(query.take) || 10,
    });
  }

  async create(data: ArticleCreateDto & { userId: number }): Promise<ArticleResponse> {
    return this.repo.create(data);
  }

  async detail(id: number, userId?: number): Promise<ArticleResponse | null> {
    return this.repo.findById(id);
  }

  async update(id: number, data: Partial<ArticleCreateDto>, userId: number) {
    const article = await this.repo.findById(id);
    if (!article || article.userId !== userId) throw new Error("권한이 없습니다.");
    return this.repo.update(id, data);
  }

  async remove(id: number, userId: number) {
    const article = await this.repo.findById(id);
    if (!article || article.userId !== userId) throw new Error("권한이 없습니다.");
    return this.repo.delete(id);
  }

  async like(id: number, userId: number) {
    return { success: true };
  }

  async unlike(id: number, userId: number) {
    return { success: true };
  }
}
