import { ArticleKeys, QueryType } from "../../../types/query";
import { ArticleEntity } from "../../entity/article.entity"

export interface IArticleRepo {
  findArticleByTitle: (title: string) => Promise<ArticleEntity | null>;
  findArticleById: (id: string) => Promise<ArticleEntity | null>;
  findArticleLike: (userId: string, articleId: string) => Promise<ArticleEntity | null>;
  findArticleList: <TKey extends ArticleKeys>({ offset, limit, orderBy }: QueryType<TKey>) => Promise<ArticleEntity[]>;
  create: (entity: ArticleEntity) => Promise<ArticleEntity>;
  addArticleLike: (userId: string, articleId: string) => Promise<ArticleEntity>;
  update: (entity: ArticleEntity) => Promise<ArticleEntity>;
  updateArticleLike: (userId: string, articleId: string, isLiked: boolean) => Promise<ArticleEntity>;
  delete: (articleId: string) => Promise<void>;
  count: () => Promise<number>;
}