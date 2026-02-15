import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { MulterError } from "multer";

export class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target =
        (err.meta?.target as string[])?.join(", ") || "알 수 없는 필드";
      return res
        .status(409)
        .json({ error: `${target} 필드의 데이터가 이미 존재합니다.` });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "해당 리소스를 찾을 수 없습니다." });
    }
  }

  if (err instanceof MulterError) {
    return res.status(400).json({ error: `파일 업로드 오류: ${err.message}` });
  }
  if (err instanceof Error && err.message.includes("이미지 파일만")) {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "토큰이 만료되었습니다." });
  }

  res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
}
