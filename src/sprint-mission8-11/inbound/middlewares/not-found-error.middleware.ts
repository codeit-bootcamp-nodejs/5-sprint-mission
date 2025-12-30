import { NextFunction, Request, Response } from "express";
import { BusinessExceptionType } from "../../shared/const/business.exception.info";
import { BusinessException } from "../../shared/exceptions/business.exception";

export class NotFoundErrorMiddleware {
  handler = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      next(
        new BusinessException({ type: BusinessExceptionType.NOT_PATH
        })
      )
    }
  }
}