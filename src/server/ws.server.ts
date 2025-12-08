import { Server as DefaultHttpServer } from "http";
import { Server as DefaultWsServer } from "socket.io";
import { Gateways } from "../01-inbound/gateways";


export class WsServer {
  public readonly io: DefaultWsServer;

  constructor(
    defaultHttpServer: DefaultHttpServer,
    public readonly gateways: Gateways,
  ) {
    const path = "/socket.io";

    const protocol = "http"
    const clientDomain = "localhost:4000";
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
                new Error("Not allowed by CORS policy"),
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
