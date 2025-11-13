import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "dev_access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "dev_refresh_secret";

export type JwtPayload = { sub: number; email?: string; nickname?: string };

export function signAccess(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
}

export function signRefresh(payload: Pick<JwtPayload, "sub">): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "14d" });
}

function decodeAndNarrow(
  token: string,
  secret: string,
  kind: "access" | "refresh",
): JwtPayload {
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    throw Object.assign(new Error(`Invalid ${kind} token`), { status: 401 });
  }

  const payload = decoded as jwt.JwtPayload;

  const sub = payload.sub as unknown;
  if (typeof sub !== "number") {
    throw Object.assign(new Error(`Invalid ${kind} token payload`), {
      status: 401,
    });
  }

  const email = typeof payload.email === "string" ? payload.email : undefined;
  const nickname =
    typeof payload.nickname === "string" ? payload.nickname : undefined;

  return { sub, email, nickname };
}

export function verifyAccess(token: string): JwtPayload {
  return decodeAndNarrow(token, ACCESS_SECRET, "access");
}

export function verifyRefresh(token: string): JwtPayload {
  return decodeAndNarrow(token, REFRESH_SECRET, "refresh");
}
