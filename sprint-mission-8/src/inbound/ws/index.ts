import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

type RegisterWsHandlers = (io: SocketIOServer) => void;

export function attachWsServer(
  httpServer: HttpServer,
  register: RegisterWsHandlers,
) {
  const io = new SocketIOServer(httpServer, {
    path: "/socket.io",
    cors: {
      origin: true,
      credentials: true,
    },
  });

  register(io);
  return io;
}
