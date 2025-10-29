import jwt from "jsonwebtoken";
import { IConfigManager } from "./config.manager";
import { Exception } from "../exception/exception";
import { EXCEPTIONS } from "../const/exception.info";


export interface ITokenManager {
  generate: (payload: {userId: string}) => { accessToken: string, refreshToken: string };
  verify: <TokenPayload>(token: string) => TokenPayload
}

interface TokenPayload {
  userId: string;
}

export class TokenManager implements ITokenManager {
  private _configManager;

  constructor(configManager: IConfigManager) {
    this._configManager = configManager;
  }

  // 엑세스 토큰 만료이든 리플레쉬 토큰까지 둘 다 만료이든 둘 다 갱신하기
  generate = (payload: {userId: string}) => {
    const accessToken = jwt.sign(
      payload,
      this._configManager.getParsed().TOKEN_SECRET,
      { expiresIn: this._configManager.getParsed().ACCESS_TOKEN_EXPIRES_IN },
    );
    const refreshToken = jwt.sign(
      payload,
      this._configManager.getParsed().TOKEN_SECRET,
      { expiresIn: this._configManager.getParsed().REFRESH_TOKEN_EXPIRES_IN },
    );

    return { accessToken, refreshToken };
  };

  verify = <TokenPayload>(token: string) => { // payload에 들어있는 변수들 타입 체크
    try {
      return jwt.verify(
        token,
        this._configManager.getParsed().TOKEN_SECRET,
      ) as TokenPayload;
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "TokenExpiredError") {
          // 토큰 만료 시
          throw new Exception({info: EXCEPTIONS.TOKEN_EXPIRED});
        } else {
          console.log(err);
          throw new Exception({message: "토큰 관련 에러 발생!!!"});
        } 
      }
      throw new Exception({ message: "알 수 없는 토큰 에러" });
    }
  };
}
