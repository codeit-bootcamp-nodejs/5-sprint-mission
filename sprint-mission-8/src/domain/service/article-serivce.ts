import { BaseService } from "./base-service";
import NotFoundError from "../../shared/errors/NotFoundError";
import UnauthorizedError from "../../shared/errors/UnauthorizedError";
import { EditArticleAttrs, NewArticleAttrs } from "../entity/article-entity";
import { IRepository, PaginationQuery } from "../../outbound/repository";
import { IArticleService } from "../port/service/article-service";

export class ArticleService extends BaseService implements IArticleService {
  constructor(repository: IRepository) {
    super(repository);
  }

  async createArticle(userId: number, articleData: NewArticleAttrs) {
    if (!articleData.title || !articleData.content) {
      throw new Error("제목과 내용을 모두 입력해야 합니다.");
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
    };
    const articles = await this.repository.article.loadList(processedQuery);
    return articles;
  }

  async getArticleById(articleId: number) {
    const article = await this.repository.article.loadDetail(articleId);
    if (!article) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId);
    }
    return article;
  }

  async updateArticle(
    articleId: number,
    userId: number,
    articleData: EditArticleAttrs,
  ) {
    const existing = await this.repository.article.loadDetail(articleId);
    if (!existing) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId);
    }

    if (existing.userId !== userId) {
      throw new UnauthorizedError("게시글을 수정할 권한이 없습니다.");
    }
    const updated = await this.repository.article.edit(articleId, articleData);
    return updated;
  }

  async deleteArticle(articleId: number, userId: number) {
    const existing = await this.repository.article.loadDetail(articleId);
    if (!existing) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId);
    }

    if (existing.userId !== userId) {
      throw new UnauthorizedError("게시글을 삭제할 권한이 없습니다.");
    }
    await this.repository.article.delete(articleId);
    return true;
  }

  async likeArticle(articleId: number, userId: number) {
    const article = await this.repository.article.loadDetail(articleId);
    if (!article) {
      throw new NotFoundError("존재하지 않는 게시글입니다.", articleId);
    }

    const exists = await this.repository.article.findArticleLike(
      articleId,
      userId,
    );
    if (exists) throw new Error("이미 좋아요한 게시글입니다");

    await this.repository.article.createArticleLike(articleId, userId);

    return;
  }

  async unlikeArticle(articleId: number, userId: number) {
    const exists = await this.repository.article.findArticleLike(
      articleId,
      userId,
    );
    if (!exists) throw new Error("좋아요한 내역이 없습니다");

    await this.repository.article.deleteArticleLike(articleId, userId);

    return;
  }

  async getFavoriteArticles(userId: number, query: PaginationQuery) {
    const processedQuery = {
      ...query,
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };
    return await this.repository.article.findFavoriteArticlesByUserId(
      userId,
      processedQuery,
    );
  }

  async loadMyArticles(userId: number, query: PaginationQuery) {
    const processedQuery = {
      ...query,
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };

    return await this.repository.article.loadUserArticles(
      userId,
      processedQuery,
    );
  }
}
