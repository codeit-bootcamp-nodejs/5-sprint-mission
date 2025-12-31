import path from "path";
import multer from "multer";
import { IConfigUtil } from "../../shared/utils/config.util";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

export class MulterMiddleware {
  private _s3Uploader;

  constructor(public readonly configUtil: IConfigUtil) {
    this._s3Uploader = multer({ storage: this._createS3Storage() });
  }

  handlerImage = (key: string) => {
    return this._s3Uploader.single(key);
  };

  handlerImages = (key: string) => {
    return this._s3Uploader.array(key);
  };

  private _createS3Storage() {
    // iam 에서 만든 시스템 유저
    // 객체 라이터
    const s3Client = new S3Client({
      region: this.configUtil.getParsed().AWS_REGION,
      credentials: {
        accessKeyId: this.configUtil.getParsed().AWS_ACCESS_KEY_ID,
        secretAccessKey: this.configUtil.getParsed().AWS_SECRET_ACCESS_KEY,
      },
    });
    return multerS3({
      s3: s3Client,
      bucket: "codeit-bucket",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req: any, file: any, callback: any) => {
        const originalname = file.originalname;
        const ext = path.extname(originalname);
        const filename =
          path.basename(originalname, ext) + "." + Date.now() + ext;
        callback(null, `images/${filename}`);
      },
      acl: "public-read",
    });
  }
}
