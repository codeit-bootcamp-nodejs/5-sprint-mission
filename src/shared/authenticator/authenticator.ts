import bcrypt, { hash } from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { NextFunction, Request, Response } from "express";
import { ExtendedError } from "socket.io/dist/namespace";
import { Socket } from "socket.io/dist/socket";
import { IUserRepository } from "../../02-domain/port/repositories/I.user.repository";
import { BusinessException, BusinessExceptionType } from "../exception/exception";


export class HttpError extends Error {
  constructor(message: string, code: number) {
    super(message);
    code = code;
  }
}

export const Authenticator = (userRepository: IUserRepository) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw BusinessException({
      type: BusinessExceptionType.DATA_NOT_FOUND,
    });
  }

  const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    expressjwt({
      secret: jwtSecret,
      algorithms: ["HS256"],
      requestProperty: "user",
    })(req, res, (err) => {
      if (err) {
        if (err.name === "UnauthorizedError") {
          return next(BusinessException({
            type: BusinessExceptionType.UNAUTORIZED_REQUEST,
          }));
        }
        return next(err);
      }
      next();
    });
  };

  const verifyRefreshToken = expressjwt({
    secret: jwtSecret,
    algorithms: ["HS256"],
    getToken: (req) => {
      return req.cookies?.refreshToken;
    },
  });

  const checkAuthWs = (socket: Socket, next: (err?: ExtendedError) => void) => {
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
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
        userId: string;
      };
      socket.data.userId = payload.userId;
    } catch (err) { }
    return next();
  };

  const filterSensitiveUserData = (user: any) => {
    const { password, refreshToken, ...nonSensitiveUserData } = user;
    return nonSensitiveUserData;
  };

  const verifyPassword = async (
    inputPassword: string,
    savedPassword: string,
  ) => {
    const isMatch = await bcrypt.compare(inputPassword, savedPassword);
    if (!isMatch) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }
  };

  const createHashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  const createToken = (user: any, type?: "access" | "refresh") => {
    const payload = { userId: user.id };
    const options: SignOptions = {
      expiresIn: type === "refresh" ? "2w" : "1h",
    };

    const jwtToken: Secret = process.env.JWT_SECRET!;
    return jwt.sign(payload, jwtToken, options);
  };

  const refreshToken = async (userId: string, refreshToken: string) => {
    const user = await userRepository.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    return createToken(user);
  };

  const verifyUserAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user.userId;
      const user = await userRepository.findById(userId);

      if (!user) {
        throw BusinessException({
          type: BusinessExceptionType.DATA_NOT_FOUND,
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };

  return {
    verifyAccessToken,
    verifyRefreshToken,
    filterSensitiveUserData,
    verifyPassword,
    createHashPassword,
    createToken,
    refreshToken,
    checkAuthWs,
    verifyUserAuth,
  };
};

export type AuthenticatorType = ReturnType<typeof Authenticator>;
