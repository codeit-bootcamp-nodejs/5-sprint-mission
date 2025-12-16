import { Request, Response, NextFunction } from "express";
import { StructError } from "superstruct";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";
import {
  TechnicalException,
  TechnicalExceptionType,
} from "../../common/errors/technical.exception";
import { ExpressMiddleware } from "../../common/types/common";

interface ErrorWithCode extends Error {
  code?: string;
  status?: number;
}

export const defaultNotFoundHandler: ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).send({ message: "Not found" });
};

type ErrorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export const globalErrorHandler: ErrorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof BusinessException) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (err instanceof StructError) {
    res.status(400).send({ message: err.message });
    return;
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).send({ message: "Invalid JSON" });
    return;
  }

  if (err.code) {
    console.error(err);
    res.status(500).send({ message: "Failed to process data" });
    return;
  }

  if (err instanceof TechnicalException) {
    res.status(500).send({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).send({ message: "Internal server error" });
};
