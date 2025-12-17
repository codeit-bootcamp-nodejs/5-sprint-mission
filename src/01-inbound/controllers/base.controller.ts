import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import z from "zod";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";

export const BaseController = (_basePath: string) => {
  const basePath = _basePath;
  const router = express.Router();

  const validate = <T extends z.ZodType>(schema: T, data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        result.error.issues.pop()?.message ??
        "요청 데이터가 유효하지 않습니다.";
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR,
      });
    }
    return result.data;
  };

  const errorHandler = (handler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        console.log(err);
        next(err);
      }
    };
  };

  return {
    basePath,
    router,
    validate,
    errorHandler,
  };
};
