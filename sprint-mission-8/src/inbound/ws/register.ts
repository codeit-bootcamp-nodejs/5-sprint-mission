import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { socketAuth } from "../middlewares/authenticate";
import { NotificationGateway } from "../gateway/notification-gateway";
import { setWsServer } from "./ws-emitter";

type WsDeps = {
  prisma: PrismaClient;
};

export function registerWsHandlers(io: SocketIOServer, deps: WsDeps) {
  io.use(socketAuth(deps.prisma));
  setWsServer(io);

  new NotificationGateway().register(io);
}
