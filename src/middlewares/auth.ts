import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../lib/token";
import { prisma } from "../lib/prisma";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "토큰이 없습니다." });

    const token = header.split(" ")[1] ?? "";
    const payload = verifyAccess(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
    }

    req.user = user;
    next();
  } catch (_e: unknown) {
    return res.status(401).json({ message: "인증 실패" });
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

    const token = header.split(" ")[1] ?? "";
    const payload = verifyAccess(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (user) req.user = user;
    next();
  } catch {
    next();
  }
};
