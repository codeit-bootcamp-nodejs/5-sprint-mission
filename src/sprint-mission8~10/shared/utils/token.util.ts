import jwt from "jsonwebtoken";
import { IConfigUtil } from "./config.util";
import { BusinessExceptionType } from "../const/business.exception.info";
import { BusinessException } from "../exceptions/business.exception";

interface TokenPayload {
  userId: string;
}

export interface ITokenUtil {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string
  verifyToken: (token: string) => TokenPayload
}

export class TokenUtil implements ITokenUtil {
  constructor(private _config: IConfigUtil) {
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this._config.getParsed().TOKEN_SECRET, {
      expiresIn: this._config.getParsed().ACCESS_TOKEN_EXPIRES_IN,
    });
  }
  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this._config.getParsed().TOKEN_SECRET, {
      expiresIn: this._config.getParsed().REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  verifyToken(token: string) { // payload에 들어있는 변수들 타입 체크
    try {
      return jwt.verify(
        token,
        this._config.getParsed().TOKEN_SECRET,
      ) as TokenPayload;
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "TokenExpiredError") {
          // 토큰 만료 시
          throw new BusinessException({ type: BusinessExceptionType.TOKEN_EXPIRED });
        } else {
          console.log(err);
          throw new BusinessException({ type: BusinessExceptionType.INVALID_TOKEN });
        }
      }
      throw new BusinessException({
        type: BusinessExceptionType.INVALID_TOKEN,
        message: "알 수 없는 토큰 에러"
      });
    }
  };
}
