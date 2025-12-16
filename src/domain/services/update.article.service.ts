import { Article } from "../entities/article.entity";
import { IArticleRepository } from "../ports/I.article.repository";
import { ID } from "../../common/types/common";

export class UpdateArticleService {
  constructor(private articleRepository: IArticleRepository) {}

  async update(input: {
    id: ID;
    data: {
      title?: string;
      content?: string;
      image?: string | null;
    };
    userId: ID;
  }): Promise<Article> {
    const article = await this.articleRepository.findById(input.id);
    if (!article) {
      throw new Error(`Article with id ${input.id} not found`);
    }

    if (!article.canBeModifiedBy(input.userId)) {
      throw new Error("You do not have permission to modify this article");
    }

    if (
      input.data.title !== undefined &&
      input.data.title.trim().length === 0
    ) {
      throw new Error("제목은 비워둘 수 없습니다.");
    }

    if (
      input.data.content !== undefined &&
      input.data.content.trim().length === 0
    ) {
      throw new Error("내용은 비워둘 수 없습니다.");
    }

    const updated = await this.articleRepository.update(input.id, input.data);

    return updated;
  }
}
