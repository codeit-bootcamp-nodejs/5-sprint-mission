import { IArticleRepository } from "../ports/I.article.repository";
import { ID } from "../../common/types/common";

export class DeleteArticleService {
  constructor(private articleRepository: IArticleRepository) {}

  async delete(input: { id: ID; userId: ID }): Promise<void> {
    const article = await this.articleRepository.findById(input.id);
    if (!article) {
      throw new Error(`Article with id ${input.id} not found`);
    }

    if (!article.canBeDeletedBy(input.userId)) {
      throw new Error("You do not have permission to delete this article");
    }

    await this.articleRepository.delete(input.id);
  }
}
