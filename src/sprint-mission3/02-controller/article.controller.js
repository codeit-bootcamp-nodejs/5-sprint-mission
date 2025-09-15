import { BaseContolloer } from "./base.controller.js";

export class ArticleController extends BaseContolloer{
  #articleMeddleware;

  constructor(articleMeddleware){
    super("/api/article");
    this.#articleMeddleware = articleMeddleware;
    this.registerRouter();
  }

  registerRouter = () => {
    this.router.post(
      "/create",
      this.catchException(this.#articleMeddleware.createArticleMiddleware)
    );
    this.router.get(
      "/view/:title",
      this.catchException(this.#articleMeddleware.viewArticleMiddleware)
    );
    this.router.get(
      "/viewList",
      this.catchException(this.#articleMeddleware.viewArticleListMiddleware)
    );
    this.router.patch(
      "/update",
      this.catchException(this.#articleMeddleware.updateArticleMiddleware)
    );
    this.router.delete(
      "/delete",
      this.catchException(this.#articleMeddleware.deleteArticleMiddleware)
    );
  };
}