import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma.client";
import { Request, Response, NextFunction } from "express";

interface AuthPayload extends JwtPayload {
  userId: number;
}

export default async function authOptionalMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET_KEY가 .env 파일에 설정되지 않았습니다.");
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
      req.user = null;
      return next();
    }
    const token = tokenParts[1];

    let payload: AuthPayload;
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

      if (
        typeof decoded !== "object" ||
        decoded === null ||
        !("userId" in decoded) ||
        typeof decoded.userId !== "number"
      ) {
        req.user = null;
        return next();
      }

      payload = decoded as AuthPayload;
    } catch (error: unknown) {
      req.user = null;
      return next();
    }

    const userId = payload.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });

    req.user = user || null;

    next();
  } catch (error) {
    next(error);
  }
}
