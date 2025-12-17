export enum NotificationType {
  PRICE_CHANGED = 'PRICE_CHANGED',
  NEW_COMMENT = 'NEW_COMMENT',
}

export interface BaseNotification {
  id: number;
  userId: number;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceNotification extends BaseNotification {
  type: NotificationType.PRICE_CHANGED;
  payload: {
    productId: number;
    price: number;
  };
}

export interface CommentNotification extends BaseNotification {
  type: NotificationType.NEW_COMMENT;
  payload: {
    articleId: number;
  };
}

export type Notification = PriceNotification | CommentNotification;
