import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { IUtils } from "../../shared/util";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Controllers } from "../controllers";

export class BaseRouter {
  public router;

  constructor(
    public readonly basePath: string,
    public readonly controllers: Controllers,
    public readonly utils: IUtils
  ) {
    this.basePath = basePath;
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
    
    const decoded = this.utils.token.verifyToken(token);
    req.userId = decoded.userId;
    if(!req.userId){
      throw new Exception({info: EXCEPTIONS.USERID_NOT_EXIST});
    }
    next();
  };
}
