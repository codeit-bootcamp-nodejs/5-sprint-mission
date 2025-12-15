// sprint-mission-8/src/inbound/controllers/image-controller.ts
import fs from "fs";
import path from "path";
import multer from "multer";
import { Request, Response } from "express";
import BadRequestError from "../../shared/errors/BadRequestError";
import { BaseController } from "./base-controller";
import { IImageController } from "../controller";
import { IService } from "../../domain/service";
import { Middlewares } from "../middlewares";
import { IConfigUtil } from "../../shared/config";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      `image-${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`,
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ok = allowedTypes.test(file.mimetype);
    if (!ok) {
      cb(new BadRequestError("이미지 파일만 업로드 가능합니다."));
      return;
    }
    cb(null, true);
  },
});

export class ImageController
  extends BaseController
  implements IImageController
{
  constructor(
    middlewares: Middlewares,
    service: IService,
    configUtils: IConfigUtil,
  ) {
    super("/images", middlewares, service, configUtils);
    this.register();
  }

  register() {
    this.router.post(
      "/upload",
      this.middlewares.auth({ optional: false }),
      upload.single("image"),
      this.catch(this.uploadSingle),
    );
  }

  uploadSingle = async (req: Request, res: Response) => {
    if (!req.file) throw new BadRequestError("업로드된 파일이 없습니다.");
    const url = `${this.configUtil.parsed().IMAGE_BASE_URL}/${req.file.filename}`;
    res.status(201).json({ message: "파일 업로드 성공", url });
  };
}
