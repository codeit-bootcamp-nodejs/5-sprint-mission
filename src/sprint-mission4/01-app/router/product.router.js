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
  };
}
