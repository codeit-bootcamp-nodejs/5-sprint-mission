import { signToken, signRefreshToken } from "../../common/lib/jwt";
import { SignOptions } from "jsonwebtoken";

export function createAuthHeader(
  userId: number,
  options: SignOptions = {},
): string {
  const token = signToken({ userId }, options);
  return `Bearer ${token}`;
}

export function createRefreshToken(
  userId: number,
  options: SignOptions = {},
): string {
  return signRefreshToken({ userId }, options);
}

export function createExpiredAuthHeader(userId: number): string {
  const token = signToken({ userId }, { expiresIn: "0s" });
  return `Bearer ${token}`;
}

export const INVALID_AUTH_HEADERS = {
  missingBearer:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwMzc2MDAwMH0.invalid",
  malformed: "Bearer invalid_token_format",
  empty: "",
  null: null as any,
};

export function createTokenPair(userId: number) {
  return {
    accessToken: createAuthHeader(userId),
    refreshToken: createRefreshToken(userId),
  };
}
