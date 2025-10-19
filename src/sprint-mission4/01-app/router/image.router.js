import { BaseRouter } from "./base.router.js";

export class ImageRouter extends BaseRouter {
  #managers;
  #controllers;

  constructor({ managers, controllers }) {
    super("/api/images");
    this.#managers = managers;
    this.#controllers = controllers;
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this.#managers.file.uploadFileMiddleware("image"),
      this.catchException(this.#controllers.image.uploadImageController),
    );
  };
}
