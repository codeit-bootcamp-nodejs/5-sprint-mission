export class ImageController {
  uploadImageController = async (req, res, next) => {
    return res.json(`http://localhost:3000/${req.file.filename}`);
  };
}
