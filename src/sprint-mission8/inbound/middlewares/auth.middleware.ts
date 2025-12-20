import { NextFunction, Request, Response } from "express";
import { ExtendedError, Socket } from "socket.io";
import { ITokenUtil } from "../../shared/util/token.util";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";

export class AuthMiddleware {
  constructor(private readonly _tokenUtil: ITokenUtil) {}

  isGuest = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
      throw new Exception({
        message: "인증 과정이 필요 없습니다."
      })
    }
  }

  isUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(
      !authHeader ||
      authHeader.split(" ").length !== 2 ||
      authHeader.split(" ")[0] !== "Bearer"
    ) {
      throw new Exception({
        info: EXCEPTIONS.INVALID_AUTH
      });
    }

    const accessToken = authHeader.split(" ")[1];
    const payload = this._tokenUtil.verifyToken( accessToken);
    req.userId = payload.userId;
    return next();
  };

  checkAuthWs = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const authHeader = socket.handshake.headers.authorization;
    if (
      !authHeader ||
      authHeader.split(" ").length !== 2 ||
      authHeader.split(" ")[0] !== "Bearer"
    ) {
      return next();
    }

    const accessToken = authHeader.split(" ")[1];
    try {
      const payload = this._tokenUtil.verifyToken(accessToken);
      socket.data.userId = payload.userId;
    } catch (err) {}
    return next();
  };
}
