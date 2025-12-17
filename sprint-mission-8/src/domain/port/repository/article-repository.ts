import { Like } from "@prisma/client";
import { PaginationQuery } from "../../../outbound/repository";
import {
  ArticleEntity,
  EditArticleAttrs,
  NewArticleAttrs,
} from "../../entity/article-entity";

export interface IArticleRepository {
  upload(
    articleData: NewArticleAttrs & { userId: number },
  ): Promise<ArticleEntity>;
  loadDetail(articleId: number): Promise<ArticleEntity | null>;
  edit(
    articleId: number,
    articleData: EditArticleAttrs,
  ): Promise<ArticleEntity>;
  delete(articleId: number): Promise<void>;
  loadList(query: PaginationQuery): Promise<ArticleEntity[]>;
  loadUserArticles(
    userId: number,
    query: PaginationQuery,
  ): Promise<ArticleEntity[]>;
  createArticleLike(articleId: number, userId: number): Promise<Like>;
  findArticleLike(articleId: number, userId: number): Promise<Like | null>;
  deleteArticleLike(articleId: number, userId: number): Promise<Like>;
  findFavoriteArticlesByUserId(
    userId: number,
    query: PaginationQuery,
  ): Promise<ArticleEntity[]>;
}
