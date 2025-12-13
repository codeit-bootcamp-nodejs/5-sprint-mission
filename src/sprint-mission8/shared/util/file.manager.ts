import { RequestHandler } from "express";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export interface IFileManager {
  createDiskStorage(key: string): RequestHandler;
  getPath(): string;
  getFilename(originalname: string): string;
  uploadFileMiddleware(key: string): RequestHandler;
}
export class FileManager implements IFileManager {
  private _path;

  constructor() {
    this._path = "public/";
  }

  createDiskStorage(key: string) {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.getPath());
      },
      filename: (req, file, cb) => {
        cb(null, this.getFilename(file.originalname));
      },
    });
    return multer({ storage }).single(key);
  }

  getPath() {
    if (!fs.existsSync(this._path)) {
      fs.mkdirSync(this._path, { recursive: true });
    }
    return this._path;
  }

  getFilename(originalname: string) {
    return uuidv4() + "-" + originalname;
  }

  uploadFileMiddleware = (key: string) => {
    return this.createDiskStorage(key);
  };
}
