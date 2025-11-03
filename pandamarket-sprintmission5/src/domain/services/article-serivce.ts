import { IRepository, PaginationQuery } from "../../repositories/repository";
import { BaseService } from "./base-service";
import { FavoriteArticleWithLike, PersistedArticleEntity } from "../entity/article-entity";
import { UploadArticleDto } from "../../dto/article/upload-article.dto";
import { EditArticleDto } from "../../dto/article/edit-article.dto";
import BadRequestError from "../../lib/errors/BadRequestError";
import NotFoundError from "../../lib/errors/NotFoundError";
import UnauthorizedError from "../../lib/errors/UnauthorizedError";


export interface IArticleService {
  createArticle: (userId: number, articleData: UploadArticleDto) => Promise<PersistedArticleEntity>;
  getArticles: (query: PaginationQuery) => Promise<PersistedArticleEntity[]>;
  getArticleById: (articleId: number) => Promise<PersistedArticleEntity | null>;
  updateArticle: (articleId: number, userId: number, articleData: EditArticleDto) => Promise<PersistedArticleEntity>;
  deleteArticle: (articleId: number, userId: number) => Promise<boolean>;
  likeArticle: (articleId: number, userId: number) => Promise<void>;
  unlikeArticle: (articleId: number, userId: number) => Promise<void>;
  getFavoriteArticles: (userId: number, query: PaginationQuery) => Promise<FavoriteArticleWithLike[]>;
  loadMyArticles:(userId: number, query: PaginationQuery) => Promise<PersistedArticleEntity[]>;
}

export class ArticleService extends BaseService implements IArticleService {
  constructor(repository: IRepository) {
    super(repository);
  }
  async createArticle(userId: number, articleData: UploadArticleDto) {
    if (!articleData.title || !articleData.content) {
      throw new BadRequestError("제목과 내용을 모두 입력해야 합니다.");
    }
    const articleDataWithUserId = { ...articleData, userId };
    const article = await this.repository.article.upload(articleDataWithUserId);
    return article;
  }

  async getArticles(query: PaginationQuery) {
    const processedQuery = {
      ...query,
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    }
    const articles = await this.repository.article.loadList(processedQuery);
    return articles;
  }

  async getArticleById(articleId: number) {
    const article = await this.repository.article.loadDetail(articleId);
    if (!article) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId);}
    return article;
  }

  async updateArticle(articleId: number,
    userId: number,
    articleData: EditArticleDto) {
    const existing = await this.repository.article.loadDetail(articleId);
    if (!existing) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId);}

    if (existing.userId !== userId) {
      throw new UnauthorizedError("게시글을 수정할 권한이 없습니다.");
    }
    const updated = await this.repository.article.edit(articleId, articleData);
    return updated;
  }

  async deleteArticle(articleId: number, userId: number) {
    const existing = await this.repository.article.loadDetail(articleId);
    if (!existing) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId)}


    if (existing.userId !== userId) {
      throw new UnauthorizedError("게시글을 삭제할 권한이 없습니다.");
    }
    await this.repository.article.delete(articleId);
    return true;
  }

  async likeArticle(articleId: number, userId: number) {
    const article = await this.repository.article.loadDetail(articleId);
    if (!article) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId)}


    const exists = await this.repository.article.findArticleLike(articleId, userId);
    if (exists) throw new BadRequestError("이미 좋아요한 게시글입니다");

    await this.repository.article.createArticleLike(articleId, userId);

    return;
  }

  async unlikeArticle(articleId: number, userId: number) {
    const exists = await this.repository.article.findArticleLike(articleId, userId);
    if (!exists) throw new BadRequestError("좋아요한 내역이 없습니다");

    await this.repository.article.deleteArticleLike(articleId, userId);

    return;
  }

  async getFavoriteArticles(userId: number, query: PaginationQuery){
    const processedQuery = {
      ...query,
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };
    return await this.repository.article.findFavoriteArticlesByUserId(userId, processedQuery);
  }

  async loadMyArticles(userId: number, query: PaginationQuery){
    const processedQuery = {
      ...query,
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };
    
    return await this.repository.article.loadUserArticles(userId, processedQuery);
  }
}
