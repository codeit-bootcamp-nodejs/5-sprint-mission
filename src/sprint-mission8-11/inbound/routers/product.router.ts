import { ProductCommentController } from "../controllers/product.comment.controller";
import { ProductController } from "../controllers/product.controller";
import { ProductLikeController } from "../controllers/product.like.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BaseRouter } from "./base.router";

export class ProductRouter extends BaseRouter {
  constructor(
    private readonly _authMiddleware: AuthMiddleware,
    private readonly _productController: ProductController,
    private readonly _productCommentController: ProductCommentController,
    private readonly _productLikeController: ProductLikeController,
  ) {
    super("/api/products");
    this.registerProductRouter();
  }

  registerProductRouter = () => {
    this.router.post(
      "/",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._productController.createProductController),
    );
    this.router.get(
      "/:productId",
      this.catchException(this._productController.getProductController),
    );
    this.router.get(
      "/",
      this.catchException(this._productController.getProductListController),
    );
    this.router.patch(
      "/:productId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._productController.updateProductController),
    );
    this.router.delete(
      "/:productId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._productController.deleteProductController),
    );

    // 댓글 기능
    this.router.post(
      "/:productId/comments",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._productCommentController.createProductCommentController,
      ),
    );
    this.router.get(
      "/:productId/comments",
      this.catchException(
        this._productCommentController.getProductCommentListController,
      ),
    );
    this.router.patch(
      "/:productId/comment/:commentId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._productCommentController.updateProductCommentController,
      ),
    );
    this.router.delete(
      "/:productId/comment/:commentId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._productCommentController.deleteProductCommentController,
      ),
    );

    // 좋아요 기능
    this.router.post(
      "/:productId/like",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._productLikeController.addProductLikeController),
    );
    this.router.delete(
      "/:productId/like",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._productLikeController.cancelProductLikeController,
      ),
    );
  };
}
