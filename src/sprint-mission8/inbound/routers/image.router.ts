import { IUtils } from "../../shared/util";
import { Controllers } from "../controllers";
import { BaseRouter } from "./base.router";

export class ImageRouter extends BaseRouter {

  constructor(controllers: Controllers, utils: IUtils) {
    super("/api/images", controllers, utils);
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this.utils.file.uploadFileMiddleware("image"),
      this.catchException(this.controllers.image.uploadImageController),
    );
  };
}
