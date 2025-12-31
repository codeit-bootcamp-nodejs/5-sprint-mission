import io from "socket.io-client";

class NotificationManager {
  private socket: ReturnType<typeof io>;
  private deviceId: string;
  private connectedClients: Array<{ deviceId: string; connectedAt: Date }> = [];

  constructor(serverUrl: string, token: string, deviceId?: string) {
    this.deviceId = deviceId || this.generateDeviceId();

    this.socket = io(serverUrl, {
      auth: {
        token,
        deviceId: this.deviceId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  private generateDeviceId(): string {
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners(): void {
    this.socket.on("connect", () => {
      console.log(`연결됨 (디바이스: ${this.deviceId})`);
    });

    this.socket.on("disconnect", () => {
      console.log(`연결 해제됨 (디바이스: ${this.deviceId})`);
    });

    this.socket.on("client:connected", (data) => {
      console.log(`새로운 클라이언트 연결됨:`, {
        deviceId: data.deviceId,
        totalClients: data.totalClients,
        connectedDevices: data.connectedDevices,
      });
      this.connectedClients = data.connectedDevices;
      this.onClientsUpdated();
    });

    this.socket.on("client:disconnected", (data) => {
      console.log(`클라이언트 연결 해제:`, {
        deviceId: data.deviceId,
        remainingClients: data.remainingClients,
      });
      this.connectedClients = data.connectedDevices;
      this.onClientsUpdated();
    });

    this.socket.on("all-clients:disconnected", () => {
      console.log("모든 클라이언트가 연결 해제됨");
      this.connectedClients = [];
    });

    this.socket.on("notification:new", (notification) => {
      console.log("새로운 알림:", notification);
      this.onNotificationReceived(notification);
    });
    this.socket.on("notification:unread-count", (count) => {
      console.log(`읽지 않은 알림: ${count}개`);
      this.onUnreadCountUpdated(count);
    });

    this.socket.on("sync:notification-read", (data) => {
      console.log("다른 클라이언트에서 알림을 읽음:", data);
      this.onNotificationSynced(data);
    });

    this.socket.on("message:direct", (data) => {
      console.log("직접 메시지:", data);
    });
  }

  public getNotifications(callback?: (response: any) => void): void {
    this.socket.emit("get:notifications", (response: any) => {
      console.log("알림 목록:", response);
      callback?.(response);
    });
  }

  public getUnreadCount(callback?: (response: any) => void): void {
    this.socket.emit("get:unread-count", (response: any) => {
      console.log(`읽지 않은 알림 개수:`, response.data.unreadCount);
      callback?.(response);
    });
  }

  public markAsRead(
    notificationId: number,
    callback?: (response: any) => void,
  ): void {
    this.socket.emit(
      "mark:notification-as-read",
      notificationId,
      (response: any) => {
        console.log("알림을 읽음으로 표시:", response);

        this.broadcastToAllClients("notification-read", { notificationId });

        callback?.(response);
      },
    );
  }

  public markAllAsRead(callback?: (response: any) => void): void {
    this.socket.emit("mark:all-notifications-as-read", (response: any) => {
      console.log("모든 알림을 읽음으로 표시:", response);

      this.broadcastToAllClients("all-notifications-read", {});

      callback?.(response);
    });
  }

  public getConnectedClients(callback?: (response: any) => void): void {
    this.socket.emit("get:connected-clients", (response: any) => {
      console.log("연결된 클라이언트:", response.data);
      this.connectedClients = response.data.clients;
      callback?.(response);
    });
  }

  public getConnectedDeviceIds(): string[] {
    return this.connectedClients.map((c) => c.deviceId);
  }

  public isCurrentDevice(deviceId: string): boolean {
    return deviceId === this.deviceId;
  }

  public sendDirectMessage(
    targetDeviceId: string,
    message: string,
    callback?: (response: any) => void,
  ): void {
    this.socket.emit(
      "send:direct-message",
      targetDeviceId,
      message,
      (response: any) => {
        console.log(`메시지 전송 완료 (대상: ${targetDeviceId}):`, response);
        callback?.(response);
      },
    );
  }

  public broadcastToAllClients(event: string, data: unknown): void {
    console.log(`모든 클라이언트에 브로드캐스트: ${event}`, data);
    this.socket.emit("broadcast:to-all-clients", event, data);
  }

  private onNotificationReceived(notification: any): void {
    console.log("알림 수신 처리:", notification);
  }

  private onUnreadCountUpdated(count: number): void {
    console.log("읽지 않은 알림 개수 업데이트:", count);
  }

  private onClientsUpdated(): void {
    console.log("연결된 클라이언트 정보 업데이트:", this.connectedClients);
  }

  private onNotificationSynced(data: any): void {
    console.log("알림 동기화:", data);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}

export default NotificationManager;
