import { Exception } from "../../common/exception.js";
import { Article } from "../entity/article.js";

export class ArticleService {
  #articleRepo;

  constructor(articleRepo) {
    this.#articleRepo = articleRepo;
  }

  viewArticle = async ({ title }) => {
    const foundArticle = await this.#articleRepo.findArticleByTitle(title);
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

    const articleTotalCount = await this.#articleRepo.count();
    if (articleTotalCount < limit) {
      throw new Exception("LIMIT_OVERFLOW", { totalCount: articleTotalCount });
    }

    const foundArticleList = await this.#articleRepo.findArticleList({
      offset,
      limit,
      orderBy,
    });

    return foundArticleList;
  };

  createArticle = async ({ title, content }) => {
    const foundArticle = await this.#articleRepo.findArticleByTitle(title);
    if (foundArticle) {
      throw new Exception("ARTICLE_ALREADY_EXIST");
    }
    const article = Article.createFactory({ title, content });

    const createdArticle = await this.#articleRepo.create(article);

    return createdArticle;
  };

  updateArticle = async ({ id, title, content }) => {
    const foundArticle = await this.#articleRepo.findArticleById(id);
    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }

    const article = Article.updateFactory({ id, title, content });

    const updatedArticle = await this.#articleRepo.update(article);

    return updatedArticle;
  };

  deleteArticle = async ({ id, title }) => {
    const foundArticle = id
      ? await this.#articleRepo.findArticleById(id)
      : await this.#articleRepo.findArticleByTitle(title);

    if (!foundArticle) {
      throw new Exception("ARTICLE_NOT_EXIST");
    }
    const article = Article.deleteFactory({ id, title });
    const deletedArticle = await this.#articleRepo.delete(article);
    return deletedArticle;
  };
}
