import { BaseRouter } from "./base.router.js";

export class ProductRouter extends BaseRouter {
  #controllers;

  constructor(controllers, managers) {
    super("/api/products", managers);
    this.#controllers = controllers;
    this.registerProductRouter();
  }

  registerProductRouter = () => {
    this.router.post(
      "/",
      this.isAuthenticate,
      this.catchException(this.#controllers.product.createProductController),
    );
    this.router.get(
      "/:productId",
      this.catchException(this.#controllers.product.getProductController),
    );
    this.router.get(
      "/",
      this.catchException(this.#controllers.product.getProductListController),
    );
    this.router.patch(
      "/:productId",
      this.isAuthenticate,
      this.catchException(this.#controllers.product.updateProductController),
    );
    this.router.delete(
      "/:productId",
      this.isAuthenticate,
      this.catchException(this.#controllers.product.deleteProductController),
    );

    // 댓글 기능
    this.router.post(
      "/:productId/comments",
      this.isAuthenticate,
      this.catchException(
        this.#controllers.productComment.createProductCommentController,
      ),
    );
    this.router.get(
      "/:productId/comments",
      this.catchException(
        this.#controllers.productComment.getProductCommentListController,
      ),
    );
    this.router.patch(
      "/:productId/comment/:commentId",
      this.isAuthenticate,
      this.catchException(
        this.#controllers.productComment.updateProductCommentController,
      ),
    );
    this.router.delete(
      "/:productId/comment/:commentId",
      this.isAuthenticate,
      this.catchException(
        this.#controllers.productComment.deleteProductCommentController,
      ),
    );

    // 좋아요 기능
    this.router.post(
      "/:productId/like",
      this.isAuthenticate,
      this.catchException(
        this.#controllers.productLike.addProductLikeController,
      ),
    );
    this.router.delete(
      "/:productId/like",
      this.isAuthenticate,
      this.catchException(
        this.#controllers.productLike.cancelProductLikeController,
      ),
    );
  };
}
