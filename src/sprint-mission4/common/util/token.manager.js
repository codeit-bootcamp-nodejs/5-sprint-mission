import jwt from "jsonwebtoken";
import { CONFIG_KEY } from "../const/config.key.js";
import { Exception } from "../const/exception.js";

export class TokenManager {
  #accessTokenExpiresIn;
  #refreshTokenExpiresIn;
  #configManager;

  constructor(configManager) {
    this.#configManager = configManager;
    this.#accessTokenExpiresIn = 60 * 60;
    this.#refreshTokenExpiresIn = "1d";
  }

  // 엑세스 토큰 만료이든 리플레쉬 토큰까지 둘 다 만료이든 둘 다 갱신하기
  generate = (payload) => {
    const accessToken = jwt.sign(
      payload,
      this.#configManager.get(CONFIG_KEY.TOKEN_SECRET),
      { expiresIn: this.#accessTokenExpiresIn },
    );
    const refreshToken = jwt.sign(
      payload,
      this.#configManager.get(CONFIG_KEY.TOKEN_SECRET),
      { expiresIn: this.#refreshTokenExpiresIn },
    );

    return { accessToken, refreshToken };
  };

  verify = (token) => {
    try {
      return jwt.verify(
        token,
        this.#configManager.get(CONFIG_KEY.TOKEN_SECRET),
      );
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        // 토큰 만료 시
        throw new Exception("TOKEN_EXPIRED");
      } else {
        console.log(err);
        throw new Error("토큰 관련 에러 발생!!!");
      }
    }
  };
}
