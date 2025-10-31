import { ControllerHandler } from "./base.controller";

export interface IImageController {
  uploadImageController: ControllerHandler;
}

export class ImageController implements IImageController {
  uploadImageController: ControllerHandler = async (req, res, next) => {
    return res.json(`http://localhost:3000/${req.file?.filename}`);
  };
}
