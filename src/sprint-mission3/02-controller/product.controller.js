import { BaseContolloer } from "./base.controller.js";


export class ProductController extends BaseContolloer {
  #productMiddleware;

  constructor(productMiddleware) {
    super("/api/product");
    this.#productMiddleware = productMiddleware;
    this.registerRouter();
  }

  registerRouter = () => {
    this.router.post(
      "/create",
      this.catchException(this.#productMiddleware.createProductMiddleware)
    );
    this.router.get(
      "/view/:name",
      this.catchException(this.#productMiddleware.viewProductMiddleware)
    );
    this.router.get(
      "/viewList",
      this.catchException(this.#productMiddleware.viewProductListMiddleware)
    );
    this.router.patch(
      "/update",
      this.catchException(this.#productMiddleware.updateProductMiddleware)
    );
    this.router.delete(
      "/delete",
      this.catchException(this.#productMiddleware.deleteProductMiddleware)
    );
  };

  
}
