import { IRepos } from "../../outbound/repos";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Exception } from "../../shared/exception/exception";
import { ArticleKeys, ArticleSort, BaseQueryType, QueryType, Sort } from "../../types/query";
import { ArticleEntity, PersistedArticleEntity } from "../entity/article.entity";
import { BaseService } from "./base.service";
export interface IArticleService {
  getArticle: ({ articleId }: GetArticleParamsType) => Promise<PersistedArticleEntity>;
  getArticleList: ({ offset, limit, sort }: BaseArticleQueryType) => Promise<PersistedArticleEntity[]>;
  addArticleLike: ({ userId, articleId }: AddArticleParamsType) => Promise<PersistedArticleEntity>;
  createArticle: ({ userId, title, content }: CreateArticleParamsType) => Promise<PersistedArticleEntity>;
  updateArticle: ({ userId, articleId, title, content }: UpdateArticleParamsType) => Promise<PersistedArticleEntity>;
  deleteArticle: ({ userId, articleId }: DeleteArticleParamsType) => Promise<void>;
  cancelArticleLike: ({ userId, articleId }: CancelArticleParamsType) => Promise<PersistedArticleEntity>;
}

type BaseArticleQueryType = BaseQueryType<ArticleSort>;
type BaseArticleParamsType = {
  articleId: string;
  userId: string;
  title: string;
  content: string;
}
type GetArticleParamsType = Pick<BaseArticleParamsType, "articleId">;
type AddArticleParamsType = Pick<BaseArticleParamsType, "userId" | "articleId">;
type CreateArticleParamsType = Pick<BaseArticleParamsType, "userId" | "title" | "content">;
type UpdateArticleParamsType = {
  articleId: string;
  userId: string;
  title?: string;
  content?: string;
};
type DeleteArticleParamsType = Pick<BaseArticleParamsType, "userId" | "articleId">;
type CancelArticleParamsType = Pick<BaseArticleParamsType, "userId" | "articleId">;

export class ArticleService extends BaseService implements IArticleService {

  constructor(repos: IRepos) {
    super(repos);
  }

  getArticle = async ({ articleId }: GetArticleParamsType) => {
    const foundArticle = await this._repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    return foundArticle;
  };

  getArticleList = async ({ offset, limit, sort }: BaseArticleQueryType) => {
    const orderBy: { field: ArticleKeys; sort: Sort; } =
      sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        }
        : sort === "title-asc"
          ? {
            field: "title",
            sort: "asc"
          }
          : {
            field: "title",
            sort: "desc"
          };

    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const articleTotalCount = await this._repos.article.count();
    if (articleTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: articleTotalCount });
    }

    const foundArticleList = await this._repos.article.findArticleList({
      offset,
      limit,
      orderBy,
    });

    return foundArticleList;
  };

  addArticleLike = async ({ userId, articleId }: AddArticleParamsType) => {
    const foundArticle = await this._repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    const existingLike = await this._repos.article.findArticleLike(
      userId,
      articleId,
    );
    if (existingLike) {
      if (!existingLike.isLiked) {
        return this._repos.article.updateArticleLike(userId, articleId, true);
      }
      throw new Exception({ info: EXCEPTIONS.LIKE_EXIST });
    }

    return this._repos.article.addArticleLike(userId, articleId);
  };

  createArticle = async ({ userId, title, content }: CreateArticleParamsType) => {
    const foundArticle = await this._repos.article.findArticleByTitle(title);
    if (foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_ALREADY_EXIST });
    }
    const article = ArticleEntity.createFactory({ userId, title, content });

    const createdArticle = await this._repos.article.create(article);

    return createdArticle;
  };

  updateArticle = async ({ userId, articleId, title, content }: UpdateArticleParamsType) => {
    const foundArticle = await this._repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    if (userId !== foundArticle.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_ARTICLE_OWNER });
    }
    const article = ArticleEntity.updateFactory({ userId, articleId, title, content });

    const updatedArticle = await this._repos.article.update(article);

    return updatedArticle;
  };

  deleteArticle = async ({ userId, articleId }: DeleteArticleParamsType) => {
    const foundArticle = await this._repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }
    if (userId !== foundArticle.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_ARTICLE_OWNER });
    }
    const deletedArticle = await this._repos.article.delete(articleId);
    return deletedArticle;
  };

  cancelArticleLike = async ({ userId, articleId }: CancelArticleParamsType) => {
    const foundArticle = await this._repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    const existingLike = await this._repos.article.findArticleLike(
      userId,
      articleId,
    );
    if (!existingLike) {
      throw new Exception({ info: EXCEPTIONS.LIKE_NOT_EXIST });
    }

    return this._repos.article.updateArticleLike(userId, articleId, false);
  };
}
