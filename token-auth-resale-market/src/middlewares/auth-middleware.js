import jwt from "jsonwebtoken";
import { Exception } from "../utils/exception.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key";

export const verifyAccessToken = (token) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET);
export const verifyRefreshToken = (token) =>
  jwt.verify(token, REFRESH_TOKEN_SECRET);

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Exception(401, "인증 토큰이 필요합니다");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Exception(401, "유효하지 않은 토큰 형식입니다");

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) throw new Exception(401, "유효하지 않은 토큰입니다");

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return next(new Exception(401, "유효하지 않은 토큰입니다"));
    if (error.name === "TokenExpiredError")
      return next(new Exception(401, "토큰이 만료되었습니다"));
    next(error);
  }
};
