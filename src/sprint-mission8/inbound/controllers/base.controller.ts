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
  protected _userService;
  protected _authService;
  protected _articleService;
  protected _productService;


  constructor(services: IServices) {
    this._userService = services.user;
    this._authService = services.auth;
    this._articleService = services.article;
    this._productService = services.product;
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