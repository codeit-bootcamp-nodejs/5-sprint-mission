import { Server as SocketIoServer, Socket, Namespace } from "socket.io";
import { BaseGateway } from "./base.gateway";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";

export class NotificationGateway extends BaseGateway {

  register(io: SocketIoServer): void {
    const notificationIo = io.of("/notifications");
    notificationIo.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) {
          throw new Exception({ info: EXCEPTIONS.INVALID_AUTH });
        }

        const payload = this.utils.token.verifyToken(token);
        socket.data.userId = payload.userId;

        next();
      } catch (err) {
        console.log(err)
      }
    })

    notificationIo.on("connection", async (socket) => {
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