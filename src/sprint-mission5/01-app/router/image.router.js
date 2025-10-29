import { BaseRouter } from "./base.router.js";

export class ImageRouter extends BaseRouter {
  #controllers;

  constructor(controllers, managers) {
    super("/api/images", managers);
    this.#controllers = controllers;
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this.fileManager.uploadFileMiddleware("image"),
      this.catchException(this.#controllers.image.uploadImageController),
    );
  };
}
