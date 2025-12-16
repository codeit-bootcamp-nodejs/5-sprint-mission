import { Article } from "../entities/article.entity";
import { IArticleRepository } from "../ports/I.article.repository";
import { ID } from "../../common/types/common";

export class CreateArticleService {
  constructor(private articleRepository: IArticleRepository) {}

  async create(input: {
    title: string;
    content: string;
    image?: string | null;
    userId: ID;
  }): Promise<Article> {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error("제목은 필수입니다.");
    }

    if (!input.content || input.content.trim().length === 0) {
      throw new Error("내용은 필수입니다.");
    }

    if (input.title.length > 255) {
      throw new Error("제목은 255자 이내여야 합니다.");
    }

    const article = await this.articleRepository.create({
      title: input.title.trim(),
      content: input.content.trim(),
      image: input.image,
      userId: input.userId,
    });

    return article;
  }
}
