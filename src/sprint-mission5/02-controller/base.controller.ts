import { ZodSafeParseResult } from "zod";
import { IServices } from "../03-domain/service/services";
import { Exception } from "../common/exception/exception";
import { EXCEPTIONS } from "../common/const/exception.info";
import { NextFunction, Request, Response } from "express";

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
  protected _commentService;


  constructor(services: IServices) {
    this._userService = services.user;
    this._authService = services.auth;
    this._articleService = services.article;
    this._productService = services.product;
    this._commentService = services.comment;
  }

  validateOrThrow = <T>(result: ZodSafeParseResult<T>): T => {
    if (!result.success) {
      throw new Exception({
        info: EXCEPTIONS.INVALID_REQUEST,
        message: result.error.message
      })
    }
    return result.data;
  }
}