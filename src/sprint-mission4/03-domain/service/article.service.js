import { Exception } from "../../common/const/exception.js";
import { Article } from "../entity/article.js";

export class ArticleService {
  #repos;

  constructor(repos) {
    this.#repos = repos;
  }

  viewArticle = async ({ id }) => {
    const foundArticle = await this.#repos.article.findArticleById(id);
    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }

    return foundArticle;
  };

  viewArticleList = async ({ offset, limit, sort }) => {
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

  createArticle = async ({ title, content }) => {
    const foundArticle = await this.#repos.article.findArticleByTitle(title);
    if (foundArticle) {
      throw new Exception("ARTICLE_ALREADY_EXIST");
    }
    const article = Article.createFactory({ title, content });

    const createdArticle = await this.#repos.article.create(article);

    return createdArticle;
  };

  updateArticle = async ({ id, title, content }) => {
    const foundArticle = await this.#repos.article.findArticleById(id);
    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }

    const article = Article.updateFactory({ id, title, content });

    const updatedArticle = await this.#repos.article.update(article);

    return updatedArticle;
  };

  deleteArticle = async ({ id, title }) => {
    const foundArticle = id
      ? await this.#repos.article.findArticleById(id)
      : await this.#repos.article.findArticleByTitle(title);

    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }
    const article = Article.deleteFactory({ id, title });
    const deletedArticle = await this.#repos.article.delete(article);
    return deletedArticle;
  };
}
