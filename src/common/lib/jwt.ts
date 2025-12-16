import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../config/constants";
import { ID } from "../types/common";

export interface JwtPayload {
  userId: ID;
  email?: string;
  nickname?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPayload {
  userId: ID;
  email?: string;
  nickname?: string;
}

export function signToken(
  payload: TokenPayload,
  options: jwt.SignOptions = {},
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m", ...options });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function signRefreshToken(
  payload: TokenPayload,
  options: jwt.SignOptions = {},
): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
    ...options,
  });
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
}
