import { BaseContoller } from "./base.controller.js";

export class ArticleController extends BaseContoller {
  #articleMiddleware;
  constructor(articleMiddleware) {
    super("/api/article");
    this.#articleMiddleware = articleMiddleware;
    this.registerArticleRouter();
  }

  registerArticleRouter = () => {
    this.router.post(
      "/create",
      this.catchException(this.#articleMiddleware.createArticleMiddleware),
    );
    this.router.get(
      "/view/:title",
      this.catchException(this.#articleMiddleware.viewArticleMiddleware),
    );
    this.router.get(
      "/viewList",
      this.catchException(this.#articleMiddleware.viewArticleListMiddleware),
    );
    this.router.patch(
      "/update",
      this.catchException(this.#articleMiddleware.updateArticleMiddleware),
    );
    this.router.delete(
      "/delete",
      this.catchException(this.#articleMiddleware.deleteArticleMiddleware),
    );
  };
}
