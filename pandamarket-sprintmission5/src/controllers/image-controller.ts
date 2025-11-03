import multer from "multer";
import path from "path";
import fs from "fs";
import BadRequestError from "../lib/errors/BadRequestError";

export interface IImageController {}

const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new BadRequestError("이미지 파일만 업로드 가능합니다."));
    }
  },
});

export const ImageController = {
  uploadSingle: [
    upload.single("image"),
    (req, res) => {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "파일이 업로드되지 않았습니다." });
      }
      res.status(200).json({
        message: "파일 업로드 성공",
        filePath: `/uploads/${req.file.filename}`,
      });
    },
  ],
};
