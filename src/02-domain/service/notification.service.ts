export class NotificationService {
  send(payload: { toUserId: string; message: string }) {
    // (15-1) 실제 알림 전송 동작 (여기서는 console.log)
    console.log("Sending notification:", payload);
  }
}