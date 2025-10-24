import { Exception } from "../../common/const/exception.js";
import { Article } from "../entity/article.js";

export class ArticleService {
  #repos;

  constructor(repos) {
    this.#repos = repos;
  }

  getArticle = async ({ articleId }) => {
    const foundArticle = await this.#repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }

    return foundArticle;
  };

  getArticleList = async ({ offset, limit, sort }) => {
    const orderBy =
      sort === "recent"
        ? { updatedAt: "desc" }
        : sort === "titleAsc"
          ? { title: "asc" }
          : { title: "desc" };

    if (limit > 20) {
      throw new Exception("LIMIT_MAX_20");
    }

    const articleTotalCount = await this.#repos.article.count();
    if (articleTotalCount < limit) {
      throw new Exception("LIMIT_OVERFLOW", { totalCount: articleTotalCount });
    }

    const foundArticleList = await this.#repos.article.findArticleList({
      offset,
      limit,
      orderBy,
    });

    return foundArticleList;
  };

  createArticle = async ({ userId, title, content }) => {
    const foundArticle = await this.#repos.article.findArticleByTitle(title);
    if (foundArticle) {
      throw new Exception("ARTICLE_ALREADY_EXIST");
    }
    const article = Article.createFactory({ userId, title, content });

    const createdArticle = await this.#repos.article.create(article);

    return createdArticle;
  };

  updateArticle = async ({ userId, articleId, title, content }) => {
    const foundArticle = await this.#repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }

    if (userId !== foundArticle.userId) {
      throw new Exception("UNAUTHORIZED_ARTICLE_OWNER");
    }
    const article = Article.updateFactory({ articleId, title, content });

    const updatedArticle = await this.#repos.article.update(article);

    return updatedArticle;
  };

  deleteArticle = async ({ userId, articleId }) => {
    const foundArticle = await this.#repos.article.findArticleById(articleId);
    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }
    if (userId !== foundArticle.userId) {
      throw new Exception("UNAUTHORIZED_ARTICLE_OWNER");
    }
    const deletedArticle = await this.#repos.article.delete(articleId);
    return deletedArticle;
  };
}
