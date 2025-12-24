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
  ) {
    super(configUtil)
  }
  register = (io: SocketIoServer): void => {
    const notificationIo = io.of("/notifications");

    this._evenBusUtil.subscribe(
      NotificationCommentCreatedEvent,
      (event) => {
        const { type, message, articleUserId } = event.notification;
        
        if (!articleUserId) return;
        notificationIo
          .to(`user:${articleUserId}`)
          .emit("notification", {
            type,
            message,
          });
      },
    );

    this._evenBusUtil.subscribe(
      NotificationPriceChangeEvent,
      (event) => {
        const { userIds, type, message } = event.notification;
        for (const targetUserId of userIds) {
          notificationIo
            .to(`user:${targetUserId}`)
            .emit("notification", {
              type,
              message,
            });
        }
      },
    );

    notificationIo.use(this._authMiddleware.checkAuthWs);

    notificationIo.on("connection", async (socket) => {
      if (!socket.data.userId) {
        throw new Exception({
          message: "인증이 안 됐습니다."
        })
      }

      const userId = socket.data.userId;

      socket.join(`user:${userId}`);

    })
  }
}