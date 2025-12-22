import { NextFunction, Request, Response } from "express";
import { Exception } from "../../shared/exception/exception";

export class NotFoundErrorMiddleware {
  handler = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      next(
        new Exception({
          message: "경로가 없습니다."
        })
      )
    }
  }
}