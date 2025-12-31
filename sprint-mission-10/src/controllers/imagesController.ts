import { Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AWS_REGION, AWS_S3_BUCKET, IS_PROD, PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { S3Client } from '@aws-sdk/client-s3';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const s3Client = new S3Client({
  region: AWS_REGION,
});

const s3Storage = multerS3({
  s3: s3Client,
  bucket: AWS_S3_BUCKET,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, PUBLIC_PATH);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage: IS_PROD ? s3Storage : diskStorage,

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    }

    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError('File is required');
  }
  if (IS_PROD) {
    const file = req.file as { location?: string };
    if (!file.location) {
      throw new BadRequestError('File location is missing');
    }
    res.send({ url: file.location });
    return;
  }
  const host = req.get('host');
  if (!host) {
    throw new BadRequestError('Host is required');
  }
  const filePath = path.join(host, STATIC_PATH, req.file.filename);
  const url = `http://${filePath}`;
  res.send({ url });
}
