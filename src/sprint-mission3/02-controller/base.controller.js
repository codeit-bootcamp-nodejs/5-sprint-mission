import express from "express";

export class BaseContolloer {
  basePath;
  router;

  constructor(basePath) {
    this.basePath = basePath;
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

  // get basePath() {
  //   return this.basePath;
  // }

  // get router() {
  //   return this.router;
  // }

  registerRouter = () => {
    throw new Error("registerRouter 구현하시오.");
  };
}
