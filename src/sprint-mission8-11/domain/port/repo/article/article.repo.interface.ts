import { ArticleKeys, Sort } from "../../../../types/query";
import {
  NewArticleEntity,
  PersistArticleEntity,
} from "../../../entity/article.entity";

export interface IArticleRepo {
  findArticleByTitle(title: string): Promise<PersistArticleEntity | null>;
  findArticleById(id: string): Promise<PersistArticleEntity | null>;
  findArticleLike(
    userId: string,
    articleId: string,
  ): Promise<PersistArticleEntity | null>;
  findUserLikeArticles(
    userId: string,
    offset: number,
    limit: number,
  ): Promise<PersistArticleEntity[] | null>;
  findArticleList(
    offset: number,
    limit: number,
    orderBy: { field: ArticleKeys; sort: Sort },
  ): Promise<PersistArticleEntity[]>;
  create(entity: NewArticleEntity): Promise<PersistArticleEntity>;
  update(entity: PersistArticleEntity): Promise<PersistArticleEntity>;
  delete(articleId: string): Promise<void>;
  count(): Promise<number>;
}
