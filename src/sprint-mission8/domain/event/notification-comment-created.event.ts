import { NotificationType } from "@prisma/client";
import { NotificationEntity } from "../entity/notification.entity";

type NotificationEventPayload = {
  id: number;
  articleId?: string; // 게시글 작성자
  productId?: string; // 상품 작성자
  userId: string; // 댓글 작성자
  type: NotificationType;
  message: string;
};

export class NotificationCommentCreatedEvent {
  constructor(
    public readonly notification: NotificationEventPayload,
    
  ) {}
}
