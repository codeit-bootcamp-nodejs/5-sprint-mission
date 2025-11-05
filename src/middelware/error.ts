import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? "Internal Server Error";
  const response: any = { message };
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }
  res.status(status).json(response);
};
