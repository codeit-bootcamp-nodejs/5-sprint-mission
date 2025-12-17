import { NotificationType } from "@prisma/client";

type NotificationEventPayload = {
  productId?: string; // 상품 작성자
  userIds: string[];
  type: NotificationType;
  message: string;
};

export class NotificationPriceChangeEvent {
  constructor(
    public readonly notification: NotificationEventPayload,
  ) {}
}
