import { IControllers } from "../../controllers/controllers";
import { IManagers } from "../../shared/util";
import { BaseRouter } from "./base.router";

export class ImageRouter extends BaseRouter {
  #controllers;

  constructor(controllers:IControllers, managers: IManagers) {
    super("/api/images", managers);
    this.#controllers = controllers;
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this._fileManager.uploadFileMiddleware("image"),
      this.catchException(this.#controllers.image.uploadImageController),
    );
  };
}
