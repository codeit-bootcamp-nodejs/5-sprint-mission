import { Notification } from "../../02-application/command/entity/notification";
import { PersistNotification } from "../repository/command/notification.command.repository";

export const NotificationMapper = {
  toPersist: (record: PersistNotification) => {
    return Notification.createPersist({
      id: record.id,
      type: record.type,
      message: record.message,
      read: record.read,
      senderId: record.senderId,
      receiverId: record.receiverId ?? undefined,
      createdAt: record.createdAt,
    });
  },
};
