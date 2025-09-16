import express from "express";

export class BaseContoller {
  basePath;
  router;
  #commentMiddleware;

  constructor(basePath, commentMiddleware = undefined) {
    this.basePath = basePath;
    this.#commentMiddleware = commentMiddleware;
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

  registerRouter(){
    this.router.post(
      "/comment/create",
      this.catchException(this.#commentMiddleware.createCommentMiddleware)
    );
  };
}
