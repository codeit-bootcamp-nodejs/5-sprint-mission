import { ControllerHandler } from "./base.controller";

export class ImageController {
  uploadImageController: ControllerHandler = async (req, res, next) => {
    return res.json(`http://localhost:3000/${req.file?.filename}`);
  };
}
