import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export class FileManager {
  #path;
  #uploader;

  constructor() {
    this.#path = "public/";
  }

  createDiskStorage(key) {
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
    if (!fs.existsSync(this.#path)) {
      fs.mkdirSync(this.#path, { recursive: true });
    }
    return this.#path;
  }

  getFilename(originalname) {
    return uuidv4() + "-" + originalname;
  }

  uploadFileMiddleware = (key) => {
    return this.createDiskStorage(key);
  };
}
