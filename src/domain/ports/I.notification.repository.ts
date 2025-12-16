import { ID } from "../../common/types/common";

export interface INotificationRepository {
  create(data: {
    recipientId: ID;
    actorId: ID;
    type: string;
    message: string;
    articleId?: ID | null;
    productId?: ID | null;
  }): Promise<{ id: ID }>;

  findByRecipientId(
    recipientId: ID,
    query: {
      limit: number;
      offset: number;
    },
  ): Promise<{ items: any[]; total: number }>;

  countUnread(recipientId: ID): Promise<number>;

  markAsRead(notificationId: ID): Promise<void>;

  markAllAsRead(recipientId: ID): Promise<void>;

  delete(notificationId: ID): Promise<void>;

  exists(notificationId: ID): Promise<boolean>;
}
