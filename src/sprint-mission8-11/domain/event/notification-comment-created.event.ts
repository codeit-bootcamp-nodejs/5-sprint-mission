import { NotificationType } from "@prisma/client";

type NotificationEventPayload = {
  id: number;
  articleId?: string;
  productId?: string;
  userId: string; // 댓글 작성자
  articleUserId?: string;
  type: NotificationType;
  message: string;
};

export class NotificationCommentCreatedEvent {
  constructor(
    public readonly notification: NotificationEventPayload,
    
  ) {}
}
