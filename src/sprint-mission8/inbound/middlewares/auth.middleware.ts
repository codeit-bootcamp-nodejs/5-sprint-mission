import { NextFunction, Request, Response } from "express";
import { ExtendedError, Socket } from "socket.io";
import { IUtils } from "../../shared/util";

export class AuthMiddleware {
  constructor(private _utils: IUtils) {}

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
      const payload = this._utils.token.verifyToken(accessToken);
      socket.data.userId = payload.userId;
    } catch (err) {}
    return next();
  };
}
