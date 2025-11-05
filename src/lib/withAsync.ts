import { Request, Response, NextFunction } from "express";
import { ExpressHandler, ExpressMiddleware } from "../types/common";

export function withAsync(handler: ExpressHandler): ExpressMiddleware {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}
