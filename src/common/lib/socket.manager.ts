import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { prismaClient } from "./prisma.client";
import { verifyToken } from "./jwt";

interface AuthenticatedSocket extends Socket {
  userId?: number;
  deviceId?: string;
}

type SocketCallback<T = NotificationResponse> = (response: T) => void;

interface NotificationResponse {
  success: boolean;
  data?: Record<string, unknown>;
  message?: string;
}

interface UserClientInfo {
  socketId: string;
  deviceId: string;
  connectedAt: Date;
  isActive: boolean;
}

const userClients = new Map<number, Map<string, UserClientInfo>>();

export let io: SocketIOServer;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      socket.deviceId = socket.handshake.auth.deviceId || socket.id;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const deviceId = socket.deviceId!;
    const socketId = socket.id;

    if (!userClients.has(userId)) {
      userClients.set(userId, new Map());
    }

    const userClientMap = userClients.get(userId)!;
    userClientMap.set(deviceId, {
      socketId,
      deviceId,
      connectedAt: new Date(),
      isActive: true,
    });

    console.log(
      `사용자 ${userId} (디바이스: ${deviceId}) 연결되었습니다. 활성 클라이언트: ${userClientMap.size}개`,
    );

    socket.join(`user:${userId}`);

    const userClientMap_current = userClients.get(userId)!;
    if (userClientMap_current.size > 1) {
      socket.to(`user:${userId}`).emit("client:connected", {
        deviceId,
        totalClients: userClientMap_current.size,
        connectedDevices: Array.from(userClientMap_current.values()).map(
          (c) => ({
            deviceId: c.deviceId,
            connectedAt: c.connectedAt,
          }),
        ),
      });
    }

    socket.on("disconnect", () => {
      const userClientMap = userClients.get(userId);
      if (userClientMap) {
        userClientMap.delete(deviceId);

        if (userClientMap.size === 0) {
          userClients.delete(userId);
          console.log(
            `사용자 ${userId}의 모든 클라이언트가 연결 해제되었습니다.`,
          );

          socket.to(`user:${userId}`).emit("all-clients:disconnected");
        } else {
          console.log(
            `사용자 ${userId} (디바이스: ${deviceId}) 연결 해제. 활성 클라이언트: ${userClientMap.size}개`,
          );

          socket.to(`user:${userId}`).emit("client:disconnected", {
            deviceId,
            remainingClients: userClientMap.size,
            connectedDevices: Array.from(userClientMap.values()).map((c) => ({
              deviceId: c.deviceId,
              connectedAt: c.connectedAt,
            })),
          });
        }
      }
    });

    socket.on(
      "get:notifications",
      async (callback: SocketCallback<NotificationResponse>) => {
        try {
          const notifications = await prismaClient.notification.findMany({
            where: { recipientId: userId },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
              actor: {
                select: { id: true, nickname: true, image: true },
              },
            },
          });

          const unreadCount = await prismaClient.notification.count({
            where: { recipientId: userId, isRead: false },
          });

          if (typeof callback === "function") {
            callback({
              success: true,
              data: {
                notifications,
                unreadCount,
              },
            });
          }
        } catch (error) {
          if (typeof callback === "function") {
            callback({
              success: false,
              message: "알림 조회 실패했습니다.",
            });
          }
        }
      },
    );

    socket.on(
      "mark:notification-as-read",
      async (
        notificationId: number,
        callback: SocketCallback<NotificationResponse>,
      ) => {
        try {
          const notification = await prismaClient.notification.findUnique({
            where: { id: notificationId },
          });

          if (!notification || notification.recipientId !== userId) {
            if (typeof callback === "function") {
              callback({
                success: false,
                message: "권한이 없습니다.",
              });
            }
            return;
          }

          const updated = await prismaClient.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
          });

          if (typeof callback === "function") {
            callback({
              success: true,
              data: updated,
            });
          }

          const unreadCount = await prismaClient.notification.count({
            where: { recipientId: userId, isRead: false },
          });

          socket.emit("notification:unread-count", unreadCount);
        } catch (error) {
          if (typeof callback === "function") {
            callback({
              success: false,
              message: "알림 읽음 처리 실패했습니다.",
            });
          }
        }
      },
    );

    socket.on(
      "mark:all-notifications-as-read",
      async (callback: SocketCallback<NotificationResponse>) => {
        try {
          await prismaClient.notification.updateMany({
            where: { recipientId: userId, isRead: false },
            data: { isRead: true },
          });

          if (typeof callback === "function") {
            callback({
              success: true,
              message: "모든 알림이 읽음으로 표시되었습니다.",
            });
          }

          socket.emit("notification:unread-count", 0);
        } catch (error) {
          if (typeof callback === "function") {
            callback({
              success: false,
              message: "전체 알림 읽음 처리 실패",
            });
          }
        }
      },
    );

    socket.on(
      "get:unread-count",
      async (callback: SocketCallback<NotificationResponse>) => {
        try {
          const unreadCount = await prismaClient.notification.count({
            where: { recipientId: userId, isRead: false },
          });

          if (typeof callback === "function") {
            callback({
              success: true,
              data: {
                unreadCount,
              },
            });
          }
        } catch (error) {
          if (typeof callback === "function") {
            callback({
              success: false,
              message: "안 읽은 알림 개수 조회 실패",
            });
          }
        }
      },
    );

    socket.on(
      "get:connected-clients",
      (callback: SocketCallback<NotificationResponse>) => {
        try {
          const userClientMap = userClients.get(userId);
          const clients = userClientMap
            ? Array.from(userClientMap.values()).map((c) => ({
                deviceId: c.deviceId,
                isCurrentClient: c.socketId === socketId,
                connectedAt: c.connectedAt,
              }))
            : [];

          if (typeof callback === "function") {
            callback({
              success: true,
              data: {
                totalClients: clients.length,
                clients,
              },
            });
          }
        } catch (error) {
          if (typeof callback === "function") {
            callback({
              success: false,
              message: "클라이언트 정보 조회 실패",
            });
          }
        }
      },
    );

    socket.on(
      "send:direct-message",
      async (
        targetDeviceId: string,
        message: string,
        callback: SocketCallback<NotificationResponse>,
      ) => {
        try {
          const userClientMap = userClients.get(userId);
          if (!userClientMap || !userClientMap.has(targetDeviceId)) {
            if (typeof callback === "function") {
              callback({
                success: false,
                message: "대상 클라이언트를 찾을 수 없습니다.",
              });
            }
            return;
          }

          const targetClient = userClientMap.get(targetDeviceId)!;
          io.to(targetClient.socketId).emit("message:direct", {
            from: socket.userId,
            message,
            timestamp: new Date(),
          });

          if (typeof callback === "function") {
            callback({
              success: true,
              message: "메시지 전송 완료",
            });
          }
        } catch (error) {
          if (typeof callback === "function") {
            callback({
              success: false,
              message: "메시지 전송 실패",
            });
          }
        }
      },
    );

    socket.on(
      "broadcast:to-all-clients",
      async (event: string, data: unknown) => {
        try {
          const userClientMap = userClients.get(userId);
          if (userClientMap) {
            for (const clientInfo of userClientMap.values()) {
              io.to(clientInfo.socketId).emit(`sync:${event}`, data);
            }
          }
        } catch (error) {
          console.error("브로드캐스트 실패:", error);
        }
      },
    );
  });

  return io;
}

export function broadcastToAllUserClients(
  userId: number,
  eventName: string,
  data: unknown,
): number {
  const userClientMap = userClients.get(userId);
  if (!userClientMap) {
    return 0;
  }

  let count = 0;
  for (const clientInfo of userClientMap.values()) {
    io.to(clientInfo.socketId).emit(eventName, data);
    count++;
  }

  return count;
}

export async function sendNotificationToUser(
  recipientId: number,
  notification: {
    type: string;
    message: string;
    actorId: number;
    articleId?: number;
    productId?: number;
    commentId?: number;
  },
) {
  try {
    const savedNotification = await prismaClient.notification.create({
      data: {
        recipientId,
        ...notification,
      },
      include: {
        actor: {
          select: { id: true, nickname: true, image: true },
        },
      },
    });

    if (io) {
      const clientCount = broadcastToAllUserClients(
        recipientId,
        "notification:new",
        savedNotification,
      );
      console.log(
        `알림 전송: 사용자 ${recipientId}의 ${clientCount}개 클라이언트에 전달됨`,
      );
    }

    return savedNotification;
  } catch (error) {
    console.error("알림 전송 실패:", error);
    throw error;
  }
}

export function getConnectedUsersCount(): number {
  return io?.engine?.clientsCount || 0;
}
