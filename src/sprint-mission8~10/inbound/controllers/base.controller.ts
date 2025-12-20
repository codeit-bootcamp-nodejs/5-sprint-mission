import { ZodSafeParseResult } from "zod";
import { NextFunction, Request, Response } from "express";
import { IServices } from "../port/services.interface";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";

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
      throw new Exception({
        info: EXCEPTIONS.ZOD_FORM,
        message: result.error.issues[0].message,
      });
    }
    return result.data;
  }
}