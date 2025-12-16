import { Article } from "../entities/article.entity";
import { IArticleRepository } from "../ports/I.article.repository";
import { ID } from "../../common/types/common";

export class GetArticleService {
  constructor(private articleRepository: IArticleRepository) {}

  async get(id: ID): Promise<Article> {
    const article = await this.articleRepository.findById(id);

    if (!article) {
      throw new Error(`Article with id ${id} not found`);
    }

    return article;
  }
}
