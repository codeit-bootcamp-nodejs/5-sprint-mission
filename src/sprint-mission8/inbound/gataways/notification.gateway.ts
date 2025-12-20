import { Server as SocketIoServer, Socket, Namespace } from "socket.io";
import { BaseGateway } from "./base.gateway";
import { Exception } from "../../shared/exception/exception";
import { NotificationCommentCreatedEvent } from "../../domain/event/notification-comment-created.event";
import { NotificationPriceChangeEvent } from "../../domain/event/notification-price-change.event";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { IEventBusUtil } from "../../shared/util/event-bus.util";
import { IConfigUtil } from "../../shared/util/config.util";

export class NotificationGateway extends BaseGateway {
  constructor(
    private readonly _authMiddleware: AuthMiddleware,
    private readonly _evenBusUtil: IEventBusUtil,
    configUtil: IConfigUtil
  ){
    super(configUtil)
  }
  register = (io: SocketIoServer): void => {
    const notificationIo = io.of("/notifications");

    this._evenBusUtil.subscribe(
      NotificationCommentCreatedEvent,
      (event) => {
        const { userId, type, productId, articleId } = event.notification;

        if (productId) {
          notificationIo
            .to(`user:${productId}`)
            .emit(`${type} notification!!! (commentWriter: ${userId})`);
        }
        if (articleId) {
          notificationIo
            .to(`user:${articleId}`)
            .emit(`${type} notification!!! (commentWriter: ${userId})`);
        }
      },
    );

    this._evenBusUtil.subscribe(
      NotificationPriceChangeEvent,
      (event) => {
        const { userIds, type, message } = event.notification;
        for (const targetUserId of userIds) {
          notificationIo
            .to(`user:${targetUserId}`)
            .emit(`${type}, ${message}`);
        }
      },
    );

    // notificationIo.use((socket, next) => {
    //   try {
    //     const token = socket.handshake.auth?.token;
    //     if (!token) {
    //       throw new Exception({ info: EXCEPTIONS.INVALID_AUTH });
    //     }

    //     const payload = this.utils.token.verifyToken(token);
    //     socket.data.userId = payload.userId;

    //     next();
    //   } catch (err) {
    //     console.log(err)
    //   }
    // })

    notificationIo.use(this._authMiddleware.checkAuthWs);

    notificationIo.on("connection", async (socket) => {
      if (!socket.data.userId) {
        throw new Exception({
          message: "인증이 안 됐습니다."
        })
      }

      const userId = socket.data.userId;

      socket.join(`user:${userId}`);

      socket.on(
        "getNotifications",
        this.catch(socket, async () => {
          //처리
        })
      ).on("disconnect", () => { });

    })
  }
}