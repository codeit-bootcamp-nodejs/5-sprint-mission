import { BaseRouter } from "./base.router.js";

export class ArticleRouter extends BaseRouter {
  #articleController;
  constructor(articleController) {
    super("/api/articles");
    this.#articleController = articleController;
    this.registerArticleRouter();
  }

  registerArticleRouter = () => {
    this.router.post(
      "/",
      this.catchException(this.#articleController.createArticleController),
    );
    this.router.get(
      "/:id",
      this.catchException(this.#articleController.viewArticleController),
    );
    this.router.get(
      "/",
      this.catchException(this.#articleController.viewArticleListController),
    );
    this.router.patch(
      "/:id",
      this.catchException(this.#articleController.updateArticleController),
    );
    this.router.delete(
      "/:id",
      this.catchException(this.#articleController.deleteArticleController),
    );
  };
}
