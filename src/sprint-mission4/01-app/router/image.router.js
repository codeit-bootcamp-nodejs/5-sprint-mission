import { BaseRouter } from "./base.router.js";

export class ImageRouter extends BaseRouter {
  #managers;
  #imageController;

  constructor({ managers, imageController }) {
    super("/api/images");
    this.#managers = managers;
    this.#imageController = imageController;
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this.#managers.file.uploadFileMiddleware("image"),
      this.catchException(this.#imageController.uploadImageController),
    );
  };
}
