import fs from "fs";
import path from "path";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";


export class MulterMiddleware {
    private _s3Uploader;

    constructor() {
        this._s3Uploader = multer({ storage: this._createS3Storage() })
    }

    handlerImages = (key: string) => {
        return this._s3Uploader.array(key);
    };

    private _createS3Storage() {
        // iam 에서 만든 시스템 유저
        // 객체 라이터
        const region = process.env.REGION;
        const access_key = process.env.ACCESS_KEY_ID;
        const secret_access_key = process.env.SECRET_ACCESS_KEY

        if (!region || !access_key || !secret_access_key) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND,
            });
        }

        const s3Client = new S3Client({
            region: region,
            credentials: {
                accessKeyId: access_key,
                secretAccessKey: secret_access_key
            }
        });

        return multerS3({
            s3: s3Client,
            bucket: "amzon-s3-bucket-for-me",
            key: (req: any, file: any, callback: any) => {
                const originalname = file.originalname;
                const ext = path.extname(originalname);
                const filename = path.basename(originalname, ext) + "." + Date.now() + ext
                callback(null, filename);
            },
            acl: "public-read"
        });
    }
}