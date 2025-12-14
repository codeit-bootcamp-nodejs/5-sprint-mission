import { Notification } from "../../02-domain/entity/notification";
import { PersistNotification } from "../repository/notification.repository";

export const NotificationMapper = {
  toPersist: (record: PersistNotification) => {
    return Notification.createPersist({
      id: record.id,
      type: record.type,
      message: record.message,
      read: record.read,
      senderId: record.senderId,
      receiverId: record.receiverId,
      createdAt: record.createdAt,
    });
  },
};
