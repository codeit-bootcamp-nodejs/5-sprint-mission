import { Server as DefaultHttpServer } from "http";
import { Server as DefaultWsServer } from "socket.io";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { NotificationGateway } from "../gataways/notification.gateway";
import { IConfigUtil } from "../../shared/util/config.util";

export class WsServer {
  public readonly io: DefaultWsServer;

  constructor(
    public readonly defaultHttpServer: DefaultHttpServer,
    public readonly notificationGateway: NotificationGateway,
    public readonly configUtil: IConfigUtil
  ) {
    const path = "/socket.io";

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
    this.notificationGateway.register(this.io);
  }
}