import { ZodSafeParseResult } from "zod";
import { NextFunction, Request, Response } from "express";
import { BusinessExceptionType } from "../../shared/const/business.exception.info";
import { BusinessException } from "../../shared/exceptions/business.exception";

export type ControllerHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any>>;

export class BaseController {
  constructor() {
  }

  validateOrThrow = <T>(result: ZodSafeParseResult<T>): T => {
    if (!result.success) {
      throw new BusinessException({ type: BusinessExceptionType.ZOD_FORM,
        message: result.error.issues[0].message,
      });
    }
    return result.data;
  }
}