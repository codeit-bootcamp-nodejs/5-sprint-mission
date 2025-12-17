import {
  ArticleEntity,
  EditArticleAttrs,
  NewArticleAttrs,
} from "../../entity/article-entity";
import { PaginationQuery } from "../../../outbound/repository";

export interface IArticleService {
  createArticle: (
    userId: number,
    articleData: NewArticleAttrs,
  ) => Promise<ArticleEntity>;
  getArticles: (query: PaginationQuery) => Promise<ArticleEntity[]>;
  getArticleById: (articleId: number) => Promise<ArticleEntity>;
  updateArticle: (
    articleId: number,
    userId: number,
    articleData: EditArticleAttrs,
  ) => Promise<ArticleEntity>;
  deleteArticle: (articleId: number, userId: number) => Promise<boolean>;
  likeArticle: (articleId: number, userId: number) => Promise<void>;
  unlikeArticle: (articleId: number, userId: number) => Promise<void>;
  getFavoriteArticles: (
    userId: number,
    query: PaginationQuery,
  ) => Promise<ArticleEntity[]>;
  loadMyArticles: (
    userId: number,
    query: PaginationQuery,
  ) => Promise<ArticleEntity[]>;
}
