import { Article } from "../entities/article.entity";
import { IArticleRepository } from "../ports/I.article.repository";

export class GetArticleListService {
  constructor(private articleRepository: IArticleRepository) {}

  async getList(query: {
    page: number;
    pageSize: number;
    keyword?: string;
    orderBy?: string;
  }): Promise<{ items: Article[]; total: number }> {
    if (query.page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (query.pageSize < 1 || query.pageSize > 100) {
      throw new Error("PageSize must be between 1 and 100");
    }

    return await this.articleRepository.findMany(query);
  }
}
