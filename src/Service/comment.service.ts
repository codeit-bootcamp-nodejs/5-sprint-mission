import { CommentRepository } from "../Repository/comment.repository";

export class CommentService {
  private repo = new CommentRepository();

  async listForProduct(productId: number) {
    return this.repo.listForProduct(productId, { orderBy: { createdAt: "desc" } });
  }

  async createForProduct(productId: number, content: string, userId: number) {
    return this.repo.createForProduct(productId, content, userId);
  }

  async listForArticle(articleId: number) {
    return this.repo.listForArticle(articleId, { orderBy: { createdAt: "desc" } });
  }

  async createForArticle(articleId: number, content: string, userId: number) {
    return this.repo.createForArticle(articleId, content, userId);
  }

  async update(id: number, content: string, userId: number) {
    const comment = await this.repo.findById(id);
    if (!comment || comment.userId !== userId) {
      throw new Error("권한이 없습니다.");
    }
    return this.repo.update(id, content);
  }

  async remove(id: number, userId: number) {
    const comment = await this.repo.findById(id);
    if (!comment || comment.userId !== userId) {
      throw new Error("권한이 없습니다.");
    }
    return this.repo.delete(id);
  }
}
