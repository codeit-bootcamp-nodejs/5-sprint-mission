import * as jwt from "jsonwebtoken";

const JWT_SECRET:jwt.Secret = process.env.JWT_SECRET || "SonHunSeok";
const ACCESS_EXPIRES: number = Number(process.env.ACCESS_TOKEN_EXPIRES_IN)|| 60*60;
const REFRESH_EXPIRES: number = Number(process.env.REFRESH_TOKEN_EXPIRES_IN)|| 60*60*24*7;

export interface TokenPayload {
  userId: string;
  nickname: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: ACCESS_EXPIRES,
    subject: 'access',
  };
  return jwt.sign(payload, JWT_SECRET, options)
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES,
    subject: "refresh",
  });
}

export function verifyToken(token: string): TokenPayload | null {
  const payload = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
  if (typeof payload === "object" && payload !== null && "userId" in payload) {
    return payload;
  }
  return null;
}
