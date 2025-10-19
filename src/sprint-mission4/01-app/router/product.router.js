import { BaseRouter } from "./base.router.js";

export class ProductRouter extends BaseRouter {
  #productController;

  constructor(productController) {
    super("/api/products");
    this.#productController = productController;
    this.registerProductRouter();
  }

  registerProductRouter = () => {
    this.router.post(
      "/",
      this.catchException(this.#productController.createProductController),
    );
    this.router.get(
      "/:name",
      this.catchException(this.#productController.viewProductController),
    );
    this.router.get(
      "/",
      this.catchException(this.#productController.viewProductListController),
    );
    this.router.patch(
      "/:id",
      this.catchException(this.#productController.updateProductController),
    );
    this.router.delete(
      "/:id",
      this.catchException(this.#productController.deleteProductController),
    );
  };
}
