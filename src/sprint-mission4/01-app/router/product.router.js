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
      this.catchException(this.#controllers.product.createProductController),
    );
    this.router.get(
      "/:name",
      this.catchException(this.#controllers.product.viewProductController),
    );
    this.router.get(
      "/",
      this.catchException(this.#controllers.product.viewProductListController),
    );
    this.router.patch(
      "/:id",
      this.catchException(this.#controllers.product.updateProductController),
    );
    this.router.delete(
      "/:id",
      this.catchException(this.#controllers.product.deleteProductController),
    );
  };
}
