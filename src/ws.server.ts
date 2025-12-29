import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { notificationGateway } from "./gateway/notification.gateway";
import jwt from "jsonwebtoken";
import prisma from "./prisma.client";

interface AuthPayload extends jwt.JwtPayload {
  userId: number;
}

export class WSServer {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }

  start() {
    this.io.use(async (socket, next) => {
      try {
        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
        if (!ACCESS_TOKEN_SECRET) {
          return next(
            new Error("서버 설정 오류: ACCESS_TOKEN_SECRET_KEY가 없습니다."),
          );
        }

        const tokenStr = socket.handshake.auth.token;
        if (!tokenStr) {
          return next(new Error("인증 토큰이 누락되었습니다."));
        }

        const tokenParts = tokenStr.split(" ");
        if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
          return next(new Error("유효하지 않은 토큰 형식입니다."));
        }
        const token = tokenParts[1];

        let payload: AuthPayload;
        try {
          const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

          if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("userId" in decoded) ||
            typeof decoded.userId !== "number"
          ) {
            return next(
              new Error("토큰 페이로드에 유효한 사용자 ID가 없습니다."),
            );
          }
          payload = decoded as AuthPayload;
        } catch (err: unknown) {
          const error = err as Error;
          if (error.name === "TokenExpiredError") {
            return next(new Error("Access Token이 만료되었습니다."));
          }
          return next(
            new Error(`유효하지 않은 Access Token입니다. (${error.message})`),
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, email: true, nickname: true },
        });

        if (!user) {
          return next(new Error("토큰에 해당하는 유저를 찾을 수 없습니다."));
        }
        socket.data.user = user;
        socket.data.userId = user.id;

        next();
      } catch (error) {
        console.error("WebSocket Auth Error:", error);
        next(new Error("서버 내부 인증 오류가 발생했습니다."));
      }
    });

    notificationGateway.register(this.io);
    console.log("WebSocket Server start.");
  }
}
