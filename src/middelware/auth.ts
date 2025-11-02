import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { PrismaClient } from "@prisma/client";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "refresh_secret";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "토큰 필요" });

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch {
    return res.status(401).json({ message: "유효하지 않은 토큰" });
  }
};

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "1h" });
  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string, prisma: PrismaClient) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };
    const tokens = generateTokens(decoded.userId);
    await prisma.user.update({ where: { id: decoded.userId }, data: { refreshToken: tokens.refreshToken } });
    return tokens;
  } catch {
    throw new Error("Refresh Token 유효하지 않음");
  }
};
