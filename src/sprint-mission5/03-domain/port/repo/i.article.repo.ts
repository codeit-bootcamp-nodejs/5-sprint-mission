import { ArticleKeys, QueryType } from "../../../types/query";
import { ArticleEntity, PersistedArticleEntity } from "../../entity/article.entity"

export interface IArticleRepo {
  findArticleByTitle: (title: string) => Promise<PersistedArticleEntity | null>;
  findArticleById: (id: string) => Promise<PersistedArticleEntity | null>;
  findArticleLike: (userId: string, articleId: string) => Promise<PersistedArticleEntity | null>;
  findArticleList: <TKey extends ArticleKeys>({ offset, limit, orderBy }: QueryType<TKey>) => Promise<PersistedArticleEntity[]>;
  create: (entity: ArticleEntity) => Promise<PersistedArticleEntity>;
  addArticleLike: (userId: string, articleId: string) => Promise<PersistedArticleEntity>;
  update: (entity: ArticleEntity) => Promise<PersistedArticleEntity>;
  updateArticleLike: (userId: string, articleId: string, isLiked: boolean) => Promise<PersistedArticleEntity>;
  delete: (articleId: string) => Promise<void>;
  count: () => Promise<number>;
}