import { notificationRepository } from "../repositories/notification.repository";
import { emitToUser } from "../socket";

export const notificationService = {
  async send(userId: number, type: string, message: string) {
    const notification = await notificationRepository.create({
      userId,
      type,
      message,
    });

    emitToUser(userId, "notification", notification);
  },
};
