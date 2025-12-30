import { NotificationType } from "@prisma/client";

export interface NotificationView {
  id: string;
  type: NotificationType;
  message: string;
  read: Boolean;
  sender: {
    nickname: string;
  };
  receiver: {
    nickname: string;
  };
  createdAt: Date;
}
