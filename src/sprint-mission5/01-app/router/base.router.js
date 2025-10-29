import express from "express";
import { Exception } from "../../common/const/exception.js";

export class BaseRouter {
  basePath;
  router;
  tokeManager;
  fileManager;
  

  constructor(basePath, managers) {
    this.basePath = basePath;
    this.tokeManager = managers.token;
    this.fileManager = managers.file;
    this.router = express.Router();
  }

  /***
   * 비동기 에러를 처리하기 위해 try catch를 감싸서 재해석함.
   */
  catchException = (controllerFn) => {
    return async (req, res, next) => {
      try {
        await controllerFn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };

  isAuthenticate = (req, res, next) => {
    if (!req.headers.authorization) {
      throw new Exception("INVALID_AUTH");
    }

    const [_, token] = req.headers.authorization.split(" ");
    const decoded = this.tokeManager.verify(token);
    req.userId = decoded.userId;
    next();
  };
}
