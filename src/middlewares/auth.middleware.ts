import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma.client";
import { Request, Response, NextFunction } from "express";

interface AuthPayload extends JwtPayload {
  userId: number;
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error(
        "ACCESS_TOKEN_SECRET_KEY가 .env 파일에 설정되지 않았습니다.",
      );
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "인증 헤더(Authorization)가 누락되었습니다." });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
      return res.status(401).json({ error: "유효하지 않은 토큰 형식입니다." });
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
        return res.status(401).json({
          error:
            "토큰 페이로드에 유효한 사용자 ID(userId)가 포함되어 있지 않습니다.",
        });
      }

      payload = decoded as AuthPayload;
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Access Token이 만료되었습니다. 토큰을 갱신해주세요.",
        });
      }
      return res.status(401).json({
        error: `유효하지 않은 Access Token입니다. (${error.message})`,
      });
    }

    const userId = payload.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        password: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "토큰에 해당하는 유저를 찾을 수 없습니다." });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
