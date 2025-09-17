import { BaseContoller } from "./base.controller.js";

export class ImageController extends BaseContoller {
  #libs;
  #imageMiddleware;

  constructor({ libs, imageMiddleware }) {
    super("/api/images");
    this.#libs = libs;
    this.#imageMiddleware = imageMiddleware;
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this.#libs.fileUploader.uploadFileMiddleware("image"),
      this.catchException(this.#imageMiddleware.uploadImageMiddleware),
    );
  };
}
