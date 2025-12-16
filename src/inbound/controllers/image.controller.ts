import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  PUBLIC_PATH,
  STATIC_PATH,
  IMAGE_BASE_URL,
} from "../../common/config/constants";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR,
        message: "Only png, jpeg, and jpg are allowed",
      });
      return cb(err as any);
    }

    cb(null, true);
  },
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function uploadImage(
  req: MulterRequest,
  res: Response,
): Promise<void> {
  if (!req.file) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  const filePath = path.join(STATIC_PATH, req.file.filename);
  const url = `${IMAGE_BASE_URL}${filePath}`;
  res.send({ url });
}
