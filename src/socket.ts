import { Server } from "socket.io";
import { verifyAccess } from "./lib/token";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    try {
      console.log("소켓 시도");

      const token = socket.handshake.auth.token;
      console.log("토큰:", token ? "exist" : "missing");

      const payload = verifyAccess(token);
      console.log("페이로드:", payload);

      socket.data.userId = payload.sub;
      next();
    } catch (err) {
      console.log("소켓 에러");
      next(new Error("유효하지 않음"));
    }
  });

  io.on("connection", (socket) => {
    console.log("소켓 연결 유저:", socket.data.userId);
    socket.join(`user:${socket.data.userId}`);
  });
};
export const emitToUser = (userId: number, event: string, payload: any) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
};
