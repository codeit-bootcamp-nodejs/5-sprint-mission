import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../shared/jwt";
import { Socket } from "socket.io";
import UnauthorizedError from "../../shared/errors/UnauthorizedError";

export type Options = { optional?: boolean };

function parseBearer(authHeader?: string | null) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  return token.length ? token : null;
}

async function getUserFromToken(token: string, prisma: PrismaClient) {
  const { userId } = verifyAccessToken(token);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UnauthorizedError("인증되지 않은 사용자입니다");
  return user;
}

function getTokenFromHttp(req: Request) {
  return (
    parseBearer(req.headers.authorization) ?? req.cookies?.accessToken ?? null
  );
}

function getTokenFromSocket(socket: Socket) {
  return (
    parseBearer(socket.handshake.headers.authorization as string | undefined) ??
    (socket.handshake.auth?.token as string | undefined) ??
    null
  );
}

export class AuthenticateMiddleware {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly options: Options = {},
  ) {}

  handler = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getTokenFromHttp(req);
      if (!token) {
        if (this.options.optional) return next();
        throw new UnauthorizedError("인증되지 않은 사용자입니다");
      }

      req.user = await getUserFromToken(token, this.prisma);
      return next();
    } catch (err) {
      if (this.options.optional) return next();
      const msg =
        err instanceof UnauthorizedError
          ? err.message
          : "인증되지 않은 사용자입니다";
      return res.status(401).json({ message: msg });
    }
  };
}

export function socketAuth(prisma: PrismaClient) {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = getTokenFromSocket(socket);
      if (!token) throw new UnauthorizedError("인증 실패");
      socket.data.user = await getUserFromToken(token, prisma);
      return next();
    } catch (err) {
      const msg = err instanceof UnauthorizedError ? err.message : "인증 실패";
      return next(new Error(msg));
    }
  };
}
