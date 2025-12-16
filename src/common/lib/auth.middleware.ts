import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";
import { AuthenticatedMiddleware } from "../types/common";

export const authMiddleware: AuthenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send({ message: "인증 토큰이 필요합니다." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).send({ message: "유효하지 않은 토큰입니다." });
    return;
  }
};
