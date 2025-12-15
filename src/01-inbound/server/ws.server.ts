import { WebSocketServer } from "ws";
import { AuthenticatorType } from "../../external/authenticator";
import { IEventBus } from "../port/I.eventbus";
import { createServer, Server as HttpServer, IncomingMessage } from "node:http";
import jwt from "jsonwebtoken";
import { PersistedNotification } from "../../02-domain/entity/notification";
import { Request } from "express";
import { Socket } from "net";
import { WebSocket } from "ws";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";

require("dotenv").config();

export const createWsServer = (server: HttpServer, eventBus: IEventBus) => {
  // 클라이언트 접속 정보 & 웹소켓 서버
  const clients = new Map<string, WebSocket>();
  const wss = new WebSocketServer({ noServer: true });

  // 웹소켓 설정
  const setUp = () => {
    server.on("upgrade", checkWsAuth);
    wss.on("connection", setUpConnection);
  };

  const checkWsAuth = (req: Request, socket: Socket, head: Buffer) => {
    if (req.url !== "/") {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy();
      return;
    }

    const auth = req.headers["authorization"];
    if (!auth || !auth.startsWith("Bearer ")) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    const token = auth.slice("Bearer ".length).trim();
    if (!process.env.JWT_SECRET) throw new Error();
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    (req as any).user = payload;
    if (!req.user.userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  };

  const setUpConnection = (ws: WebSocket, req: Request) => {
    const userId = req.user.userId;

    clients.set(userId, ws); // 클라이언트 정보 저장
    ws.send(`welcome ${userId}`);

    ws.on("message", (data) => {
      console.log("ws message:", data.toString());
      ws.send(`echo: ${data}`);
    });

    ws.on("close", () => {
      clients.delete(userId);
      console.log("ws closed ", userId);
    });
  };

  // 이벤트 핸들러 등록
  const registerRoutes = () => {
    eventBus.notification.subscribe(notifyUser);
    eventBus.notification.subscribeAll(notifyAllUsers);
  };

  const notifyUser = (notification: PersistedNotification) => {
    const userId = notification.receiverId;
    const msg = notification.message;

    if (!userId) throw new Error("존재하지 않는 유저에게 알림을 보낼 수 없습니다");
    const ws = clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(msg);
  };

  const notifyAllUsers = (notification: PersistedNotification) => {
    const senderId = notification.senderId;
    const msg = notification.message;

    for (const [userId, ws] of clients.entries()) {
      if (userId === senderId) continue;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(msg);
      }
    }
  }


  const run = () => {
    setUp();
    registerRoutes();
  };

  return {
    run,
  };
};
