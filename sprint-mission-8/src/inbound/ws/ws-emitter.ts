import { Server as SocketIOServer } from "socket.io";
import { NotificationGateway } from "../gateway/notification-gateway";

let ioRef: SocketIOServer | null = null;

export const setWsServer = (io: SocketIOServer) => {
  ioRef = io;
};

export const emitNotificationToUser = (
  userId: number,
  payload: unknown,
): void => {
  if (!ioRef) return;
  NotificationGateway.emitToUser(ioRef, userId, payload);
};
