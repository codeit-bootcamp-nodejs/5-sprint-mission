import { BaseRouter } from "./base.router.js";

export class ArticleRouter extends BaseRouter {
  #controllers;
  constructor(controllers, managers) {
    super("/api/articles", managers);
    this.#controllers = controllers;
    this.registerArticleRouter();
  }

  registerArticleRouter = () => {
    this.router.post(
      "/",
      this.isAuthenticate,
      this.catchException(this.#controllers.article.createArticleController),
    );
    this.router.get(
      "/:articleId",
      this.catchException(this.#controllers.article.getArticleController),
    );
    this.router.get(
      "/",
      this.catchException(this.#controllers.article.getArticleListController),
    );
    this.router.patch(
      "/:articleId",
      this.isAuthenticate,
      this.catchException(this.#controllers.article.updateArticleController),
    );
    this.router.delete(
      "/:articleId",
      this.isAuthenticate,
      this.catchException(this.#controllers.article.deleteArticleController),
    );
    this.router.post(
      "/:articleId/comments",
      this.isAuthenticate,
      this.catchException(this.#controllers.articleComment.createArticleCommentController),
    );
    this.router.get(
      "/:articleId/comments",
      this.catchException(this.#controllers.articleComment.getArticleCommentListController),
    );
    this.router.patch(
      "/:articleId/comment/:commentId",
      this.isAuthenticate,
      this.catchException(this.#controllers.articleComment.updateArticleCommentController),
    );
    this.router.delete(
      "/:articleId/comment/:commentId",
      this.isAuthenticate,
      this.catchException(this.#controllers.articleComment.deleteArticleCommentController),
    );
  };
}
