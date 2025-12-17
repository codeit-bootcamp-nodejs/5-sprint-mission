import { NotificationType } from "@prisma/client";

type AdditionalData = unknown;

type NotificationAttrs = {
  id?: number;
  userId?: number;
  type: NotificationType;
  title: string;
  body?: string | null;
  url?: string | null;
  data?: AdditionalData | null;
  isRead?: boolean | null;
  readAt?: Date | null;
  createdAt?: Date;
};

export type NewNotificationAttrs = Pick<
  NotificationAttrs,
  "type" | "title" | "body" | "url" | "data"
> & { userId?: number };

export type PersistedNotificationRecord = Required<
  Pick<
    NotificationAttrs,
    "id" | "userId" | "type" | "title" | "url" | "createdAt"
  >
> &
  Pick<NotificationAttrs, "body" | "data" | "readAt"| "isRead">;

export type PersistedNotificationEntity = NotificationEntity;

export class NotificationEntity {
  private readonly _id?: number;
  private readonly _userId?: number;
  private readonly _type: NotificationType;
  private readonly _createdAt?: Date;
  private _title: string;
  private _body?: string | null;
  private _url: string | null;
  private _data?: AdditionalData | null;
  private _isRead?: boolean | null;
  private _readAt?: Date | null;

  constructor(attrs: NotificationAttrs) {
    this._id = attrs.id;
    this._userId = attrs.userId;
    this._type = attrs.type;
    this._title = attrs.title;
    this._body = attrs.body ?? null;
    this._url = attrs.url ?? null;
    this._data = attrs.data ?? null;
    this._isRead = attrs.isRead;
    this._readAt = attrs.readAt ?? null;
    this._createdAt = attrs.createdAt;
  }

  static createNew(attrs: NewNotificationAttrs): NotificationEntity {
    return new NotificationEntity(attrs);
  }

  static fromPersisted(
    record: PersistedNotificationRecord,
  ): NotificationEntity {
    return new NotificationEntity(record);
  }

  markAsRead(date: Date = new Date()) {
    this._readAt = date;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get type() {
    return this._type;
  }

  get title() {
    return this._title;
  }

  get body() {
    return this._body;
  }

  get url() {
    return this._url;
  }

  get data() {
    return this._data;
  }

  get isRead(){
    return this._isRead;
  }

  get readAt() {
    return this._readAt;
  }

  get createdAt() {
    return this._createdAt;
  }
}
