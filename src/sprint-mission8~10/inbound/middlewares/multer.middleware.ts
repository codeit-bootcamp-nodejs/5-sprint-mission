import fs from "fs";
import path from "path";
import multer from "multer";
import { IConfigUtil } from "../../shared/utils/config.util";

export class MulterMiddleware {
  private _uploader;

  constructor(public readonly configUtil: IConfigUtil) {
    this._uploader = multer({ storage: this._createDiskStorage() });
  }

  handlerImage = () => {
    return this._uploader.single("image");
  };
  
  handlerImages = () => {
    return this._uploader.array("images");
  };

  handlerCsvFile = () => {
    return this._uploader.single("csv-file");
  };

  private _createDiskStorage() {
    return multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, this._getPath());
      },
      filename: (req, file, callback) => {
        callback(null, this._getFileName(file.originalname));
      },
    });
  }

  private _getPath() {
    if (!fs.existsSync(this.configUtil.getParsed().PUBLIC_PATH)) {
      fs.mkdirSync(this.configUtil.getParsed().PUBLIC_PATH, {
        recursive: true,
      });
    }
    return this.configUtil.getParsed().PUBLIC_PATH;
  }

  private _getFileName(originalname: string) {
    const ext = path.extname(originalname);
    return path.basename(originalname, ext) + "." + Date.now() + ext;
  }
}