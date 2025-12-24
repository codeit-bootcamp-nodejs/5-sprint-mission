import { ControllerHandler } from "./base.controller";

export class ImageController {
  constructor(
  ) {
  }
  uploadImageController: ControllerHandler = async (req, res, next) => {
    return res.json(`http://localhost:3000/${req.file?.filename}`);
  };
}
