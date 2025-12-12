import { ZodSafeParseResult } from "zod";
import { IServices } from "../03-domain/service/services";
import { Exception } from "../common/exception/exception";
import { EXCEPTIONS } from "../common/const/exception.info";
import { NextFunction, Request, Response } from "express";
import { fieldExceptionMap } from "./req.validator/validator.map";

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
      console.error(result.error);
      const issue = result.error.issues[0]; // 첫번째 형식 에러 먼저 처리
      const field = issue.path[0] as string;
      const matched = fieldExceptionMap[field] || EXCEPTIONS.INVALID_REQUEST;
      const zodPriorityFields = ["password", "updatePassword"]; // zod 메시지가 우선인 필드
      const finalMessage = zodPriorityFields.includes(field)
      ? issue.message
      : matched.message;

      throw new Exception({
        info: matched,
        message: finalMessage
      });
    }
    return result.data;
  }
}