import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { StructError } from "superstruct";
import AppError from "../../shared/errors/AppError";
import BadRequestError from "../../shared/errors/BadRequestError";
import { IConfigUtil } from "../../shared/config";

export class defaultNotFoundMiddleware {
  handler = () => {
    return (req: Request, res: Response) => {
      res.status(404).json({ message: "Not found", code: "NOT_FOUND" });
    };
  };
}

export class GlobalErrorMiddleware {
  constructor(public readonly configUtil: IConfigUtil) {}

  handler = () => {
    return (err: unknown, req: Request, res: Response, next: NextFunction) => {
      let normalizedError: unknown = err;

      if (err instanceof StructError) {
        normalizedError = new BadRequestError(err.message, err);
      } else if (err instanceof SyntaxError && "body" in err) {
        normalizedError = new BadRequestError("Invalid JSON", err);
      } else if (err instanceof multer.MulterError) {
        normalizedError = new BadRequestError(err.message);
      }

      if (normalizedError instanceof AppError) {
        const body: Record<string, unknown> = {
          message: normalizedError.message,
          code: normalizedError.code,
        };

        return res.status(normalizedError.status).json(body);
      }

      console.error(err);
      return res.status(500).json({
        message:
          this.configUtil.parsed().NODE_ENV === "development"
            ? ((err as Error)?.message ?? "Internal server error")
            : "Internal server error",
        code: "INTERNAL",
      });
    };
  };
}
