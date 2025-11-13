import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: "요청하신 리소스를 찾을 수 없습니다." });
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "서버 오류가 발생했습니다.",
    detail: err.detail || undefined,
  });
};
