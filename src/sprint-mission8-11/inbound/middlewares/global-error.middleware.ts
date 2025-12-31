import { NextFunction, Request, Response } from "express";
import { IConfigUtil } from "../../shared/utils/config.util";
import { BusinessException } from "../../shared/exceptions/business.exception";

export class GlobalErrorMiddleware {
  constructor(public readonly configUtil: IConfigUtil) {}

  handler = () => {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof BusinessException) {
        res.status(err.statusCode).json({ message: err.message });

        if (
          this.configUtil.getParsed().NODE_ENV === "development" ||
          this.configUtil.getParsed().NODE_ENV === "test"
        ) {
          console.error(err);
        } else {
          // TODO: Sentry 도입 후 로그(분석) 전송
        }
        return;
      }

      res.status(500).json({ message: "알 수 없는 에러 발생!!!" });

      if (this.configUtil.getParsed().NODE_ENV === "development") {
        console.error(err);
      } else {
        // TODO: Sentry 도입 후 에러(긴급) 전송
      }
    };
  };
}
