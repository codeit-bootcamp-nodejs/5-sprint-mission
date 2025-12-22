import cors from "cors";
import { IConfigUtil } from "../../shared/utils/config.util";
import { Exception } from "../../shared/exception/exception";

export class CorsMiddleware {
  private _options: cors.CorsOptions;

  constructor(private configUtil: IConfigUtil) {
    const protocol =
      this.configUtil.getParsed().NODE_ENV === "development" ? "http" : "https";
    const clientDomain =
      this.configUtil.getParsed().NODE_ENV === "development"
        ? `localhost:${this.configUtil.getParsed().PORT}`
        : this.configUtil.getParsed().CLIENT_DOMAIN;
    const whitelist = [
      `${protocol}://${clientDomain}`,
      `${protocol}://www.${clientDomain}`,
    ];
    this._options = {
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(
            new Exception({
              message: "허용되지 않은 도메인 요청입니다."
            }),
          );
        }
      },
      credentials: true,
      // allowedHeaders 옵션 생략: cors 라이브러리가 브라우저로부터 요청된 헤더를 모두 허용해 줍니다.
    };
  }

  handler = () => {
    return cors(this._options);
  };
}
