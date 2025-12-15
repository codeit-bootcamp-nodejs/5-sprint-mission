import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key";

interface AccessTokenPayload extends JwtPayload {
  id: number;
}

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export function verifyAccessToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;

  return { userId: decoded.id };
}

export function verifyRefreshToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as AccessTokenPayload;
  return { userId: decoded.id };
}
