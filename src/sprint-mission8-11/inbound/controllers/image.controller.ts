import { ControllerHandler } from "./base.controller";

export class ImageController {
  constructor(
  ) {
  }
  uploadImageController: ControllerHandler = async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
    }

    const file = req.file as Express.MulterS3.File;

    return res.json({
      imageUrl: file.location
    });
  };
}
