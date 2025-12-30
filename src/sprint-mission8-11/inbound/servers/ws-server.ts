import { Server as DefaultHttpServer } from "http";
import { Server as DefaultWsServer } from "socket.io";
import { NotificationGateway } from "../gataways/notification.gateway";
import { IConfigUtil } from "../../shared/utils/config.util";
import { BusinessExceptionType } from "../../shared/const/business.exception.info";
import { BusinessException } from "../../shared/exceptions/business.exception";

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
              new BusinessException({ type: BusinessExceptionType.CORS_ORIGIN_NOT_ALLOWED,
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