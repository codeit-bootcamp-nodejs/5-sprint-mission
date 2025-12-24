import { Request, Response, NextFunction } from "express";

export function validateNotificationId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);

  if (!id || id <= 0) {
    return res.status(400).json({ error: "유효하지 않은 알림 ID입니다." });
  }

  next();
}
