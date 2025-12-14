import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { IManagers } from "../../shared/util";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";

export class BaseRouter {
  public basePath;
  public router;
  protected _tokeManager;
  protected _fileManager;

  constructor(basePath: string, managers: IManagers) {
    this.basePath = basePath;
    this._tokeManager = managers.token;
    this._fileManager = managers.file;
    this.router = express.Router();
  }

  /***
   * 비동기 에러를 처리하기 위해 try catch를 감싸서 재해석함.
   */
  catchException = (controllerFn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await controllerFn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };

  isAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      throw new Exception({ info: EXCEPTIONS.INVALID_AUTH });
    }

    const [_, token] = req.headers.authorization.split(" ");
    
    const decoded = this._tokeManager.verify<{ userId: string }>(token);
    req.userId = decoded.userId;
    if(!req.userId){
      throw new Exception({info: EXCEPTIONS.USERID_NOT_EXIST});
    }
    next();
  };
}
