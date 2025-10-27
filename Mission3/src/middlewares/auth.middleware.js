import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;

export default async function authMiddleware(req, res, next) {
  try {
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

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Access Token이 만료되었습니다. 토큰을 갱신해주세요.",
        });
      }
      return res
        .status(401)
        .json({ error: `유효하지 않은 Access Token입니다. (${e.message})` });
    }

    const userId = payload.id;
    if (!userId) {
      return res.status(401).json({
        error: "토큰 페이로드에 사용자 ID(id)가 포함되어 있지 않습니다.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
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
