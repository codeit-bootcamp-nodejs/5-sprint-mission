import { NotificationType } from "@prisma/client";
import { BaseEntity } from "./base.entity";

export type NewNotificationEntity = Omit<
  NotificationEntity,
  "id" | "createdAt" | "updatedAt"
>;

export interface PersistNotificationEntity extends NotificationEntity {
  id: number;
  createdAt: Date;
}

export class NotificationEntity extends BaseEntity<number> {
  private readonly _userId: string;
  private readonly _type: NotificationType;
  private readonly _message: string;
  private _isRead: boolean;

  constructor(attributes: {
    id?: number;
    userId: string; // 작성자
    type: NotificationType;
    message: string;
    isRead: boolean;
    createdAt?: Date;
  }) {
    super(attributes.id, attributes.createdAt);
    this._userId = attributes.userId;
    this._type = attributes.type;
    this._message = attributes.message;
    this._isRead = attributes.isRead;
  }

  static createNew(params: {
    userId: string;
    type: NotificationType;
    message: string;
  }): NewNotificationEntity {
    return new NotificationEntity({
      ...params,
      isRead: false,
    }) as NewNotificationEntity;
  }

  static createPersist(params: {
    id: number;
    userId: string;
    type: NotificationType;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }): PersistNotificationEntity {
    return new NotificationEntity(params) as PersistNotificationEntity;
  }

  markAsRead(): void {
    if (this.isRead) {
      return;
    }
    this._isRead = true;
  }

  get userId() {
    return this._userId;
  }
  get type() {
    return this._type;
  }
  get message() {
    return this._message;
  }
  get isRead() {
    return this._isRead;
  }
}
