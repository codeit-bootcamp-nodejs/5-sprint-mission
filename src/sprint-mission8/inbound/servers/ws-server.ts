import { Server as DefaultHttpServer } from "http";
import { Server as DefaultWsServer } from "socket.io";
import { Gateways } from "../gateways";
import { IUtils } from "../../shared/util";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";

export class WsServer {
  public readonly io: DefaultWsServer;

  constructor(
    public readonly defaultHttpServer: DefaultHttpServer,
    public readonly gateways: Gateways,
    public readonly utils: IUtils
  ) {
    const path = "/socket.io";

    const protocol =
      this.utils.config.getParsed().NODE_ENV === "development" ? "http" : "https";
    const clientDomain =
      this.utils.config.getParsed().NODE_ENV === "development"
        ? `localhost:${this.utils.config.getParsed().PORT}`
        : this.utils.config.getParsed().CLIENT_DOMAIN;
    const whitelist = [
      `${protocol}://${clientDomain}`,
      `${protocol}://www.${clientDomain}`,
    ];

    this.io = new DefaultWsServer(defaultHttpServer, {
      path,
      cors: {
        origin: function (origin, callback) {
          if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(
              new Exception({
                info: EXCEPTIONS.CORS_ORIGIN_NOT_ALLOWED,
              }),
            );
          }
        },
        credentials: true,
      },
    });
  }

  start() {
    // gateways
    this.gateways.notification.register(this.io);
  }
}