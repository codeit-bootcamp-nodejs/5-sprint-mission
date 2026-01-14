import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

export class BaseRouter {
  public router;

  constructor(public readonly basePath: string) {
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
}
