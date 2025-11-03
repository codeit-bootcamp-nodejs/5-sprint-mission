import { Request, Response, NextFunction } from "express";

export function withAsync(
  handler: (req: Request, res: Response) => Promise<void>,
) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await handler(req, res);
    } catch (e) {
      next(e);
    }
  };
}
