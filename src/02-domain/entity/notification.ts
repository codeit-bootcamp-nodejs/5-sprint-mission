import { NotificationType } from "@prisma/client";

export type PersistedNotification = Notification & {
  id: string;
  createdAt: Date;
};

export type NewNotification = Omit<Notification, "id" | "createdAt">;

type Notification = {
  readonly id?: string;
  type: NotificationType;
  message: string;
  read: boolean;
  senderId: string;
  receiverId: string;
  readonly createdAt?: Date;
};

export const Notification = {
  createNew: (params: {
    type: NotificationType;
    message: string;
    read: boolean;
    senderId: string;
    receiverId: string;
  }) => {
    return {
      type: params.type,
      message: params.message,
      read: params.read,
      senderId: params.senderId,
      receiverId: params.receiverId,
    } as NewNotification;
  },

  createPersist: (params: {
    id: string;
    type: NotificationType;
    message: string;
    read: boolean;
    senderId: string;
    receiverId: string;
    createdAt: Date;
  }) => {
    return {
      id: params.id,
      type: params.type,
      message: params.message,
      read: params.read,
      senderId: params.senderId,
      receiverId: params.receiverId,
      createdAt: params.createdAt,
    } as PersistedNotification;
  },
};
