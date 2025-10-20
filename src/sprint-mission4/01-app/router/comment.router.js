import { BaseRouter } from "./base.router.js";

export class CommentRouter extends BaseRouter {
  #controllers;
  constructor(controllers) {
    super("/api");
    this.#controllers = controllers;
    this.registerCommentRouter();
  }

  registerCommentRouter = () => {
    this.router.post(
      "/product/:productId/comments",
      this.catchException(this.#controllers.productComment.createProductCommentController),
    );
    this.router.get(
      "/product/:productId/comments",
      this.catchException(this.#controllers.productComment.viewProductCommentListController),
    );
    this.router.patch(
      "/product/:productId/comment/:id",
      this.catchException(this.#controllers.productComment.updateProductCommentController),
    );
    this.router.delete(
      "/product/:productId/comment/:id",
      this.catchException(this.#controllers.productComment.deleteProductCommentController),
    );

    this.router.post(
      "/article/:articleId/comments",
      this.catchException(this.#controllers.articleComment.createArticleCommentController),
    );
    this.router.get(
      "/article/:articleId/comments",
      this.catchException(this.#controllers.articleComment.viewArticleCommentListController),
    );
    this.router.patch(
      "/article/:articleId/comment/:id",
      this.catchException(this.#controllers.articleComment.updateArticleCommentController),
    );
    this.router.delete(
      "/article/:articleId/comment/:id",
      this.catchException(this.#controllers.articleComment.deleteArticleCommentController),
    );
  };
}
