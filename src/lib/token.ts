import jwt from "jsonwebtoken";

type JwtUserPayload = { userId: number };

export const signAccess = (userId: number): string =>
  jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "15m" });

export const signRefresh = (userId: number): string =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });

export const verifyAccess = (token: string): JwtUserPayload =>
  jwt.verify(token, String(process.env.JWT_SECRET)) as { userId: number };

export const verifyRefresh = (token: string): JwtUserPayload =>
  jwt.verify(token, String(process.env.JWT_REFRESH_SECRET)) as {
    userId: number;
  };
