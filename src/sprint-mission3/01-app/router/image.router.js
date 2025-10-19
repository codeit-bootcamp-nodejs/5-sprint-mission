import { BaseRouter } from "./base.router.js";

export class ImageRouter extends BaseRouter {
  #libs;
  #imageController;

  constructor({ libs, imageController }) {
    super("/api/images");
    this.#libs = libs;
    this.#imageController = imageController;
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this.#libs.fileUploader.uploadFileMiddleware("image"),
      this.catchException(this.#imageController.uploadImageController),
    );
  };
}
