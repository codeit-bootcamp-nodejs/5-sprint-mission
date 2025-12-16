import { NotificationType } from "@prisma/client";

export interface NotificationResponseDto {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  notiType: NotificationType;
  productId: number | null;
  articleId: number | null;
  createdAt: Date;
}
