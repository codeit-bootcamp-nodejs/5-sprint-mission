import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { verifyAccess } from "../lib/token";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "토큰이 없습니다." });
    const token = header.split(" ")[1];
    const payload = verifyAccess(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user)
      return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
    req.user = user;
    next();
  } catch (e: any) {
    return res.status(401).json({ message: "인증 실패", error: e.message });
  }
};

export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header) return next();
    const token = header.split(" ")[1];
    const payload = verifyAccess(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
};
