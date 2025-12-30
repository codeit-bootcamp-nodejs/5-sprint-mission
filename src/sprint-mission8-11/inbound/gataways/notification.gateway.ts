import { Server as SocketIoServer} from "socket.io";
import { BaseGateway } from "./base.gateway";
import { NotificationCommentCreatedEvent } from "../../domain/event/notification-comment-created.event";
import { NotificationPriceChangeEvent } from "../../domain/event/notification-price-change.event";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { IEventBusUtil } from "../../shared/utils/event-bus.util";
import { IConfigUtil } from "../../shared/utils/config.util";
import { BusinessExceptionType } from "../../shared/const/business.exception.info";
import { BusinessException } from "../../shared/exceptions/business.exception";

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
        throw new BusinessException({ type: BusinessExceptionType.INVALID_AUTH
        })
      }

      const userId = socket.data.userId;

      socket.join(`user:${userId}`);

    })
  }
}