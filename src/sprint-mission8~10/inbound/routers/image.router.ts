import { IFileUtil } from "../../shared/util/file.util";
import { ImageController } from "../controllers/image.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BaseRouter } from "./base.router";

export class ImageRouter extends BaseRouter {

  constructor(
    private readonly _authMiddleware: AuthMiddleware,
    private readonly _imageController: ImageController,
    private readonly _fileUtil: IFileUtil,
  ) {
    super("/api/images");
    this.registerImageRouter();
  }

  registerImageRouter = () => {
    this.router.post(
      "/",
      this.catchException(this._authMiddleware.isUser),
      this._fileUtil.uploadFileMiddleware("image"),
      this.catchException(this._imageController.uploadImageController),
    );
  };
}
