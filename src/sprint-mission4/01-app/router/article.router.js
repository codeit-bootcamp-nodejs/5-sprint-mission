import { BaseRouter } from "./base.router.js";

export class ArticleRouter extends BaseRouter {
  #controllers;
  constructor(controllers) {
    super("/api/articles");
    this.#controllers = controllers;
    this.registerArticleRouter();
  }

  registerArticleRouter = () => {
    this.router.post(
      "/",
      this.catchException(this.#controllers.article.createArticleController),
    );
    this.router.get(
      "/:id",
      this.catchException(this.#controllers.article.viewArticleController),
    );
    this.router.get(
      "/",
      this.catchException(this.#controllers.article.viewArticleListController),
    );
    this.router.patch(
      "/:id",
      this.catchException(this.#controllers.article.updateArticleController),
    );
    this.router.delete(
      "/:id",
      this.catchException(this.#controllers.article.deleteArticleController),
    );
  };
}
