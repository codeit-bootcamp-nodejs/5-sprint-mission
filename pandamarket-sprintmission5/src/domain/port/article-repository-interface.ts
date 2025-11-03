import { Like } from "@prisma/client";
import { EditArticleDto } from "../../dto/article/edit-article.dto";
import { UploadArticleDto } from "../../dto/article/upload-article.dto";
import { PaginationQuery } from "../../repositories/repository";
import { FavoriteArticleWithLike, PersistedArticleEntity } from "../entity/article-entity";


export interface IArticleRepository {
  upload(articleData: UploadArticleDto & { userId: number }): Promise<PersistedArticleEntity>;
  loadDetail(articleId: number): Promise<PersistedArticleEntity | null>;
  edit(
    articleId: number,
    articleData: EditArticleDto,
  ): Promise<PersistedArticleEntity>;
  delete(articleId: number): Promise<void>;
  loadList(query: PaginationQuery): Promise<PersistedArticleEntity[]>;
  loadUserArticles(
    userId: number,
    query: PaginationQuery,
  ): Promise<PersistedArticleEntity[]>;
  createArticleLike(articleId: number, userId: number): Promise<Like>;
  findArticleLike(articleId: number, userId: number): Promise<Like | null>;
  deleteArticleLike(articleId: number, userId: number): Promise<Like>;
  findFavoriteArticlesByUserId(
    userId: number,
    query: PaginationQuery,
  ): Promise<FavoriteArticleWithLike[]>;

}
