import { PersistArticleEntity } from "../../../command/entity/article.entity";

export interface IArticleQueryRepo {
  findUserLikeArticles(
      userId: string,
      offset: number,
      limit: number,
    ): Promise<PersistArticleEntity[] | null>;
}