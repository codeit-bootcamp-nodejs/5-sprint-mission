import { NotificationType } from "@prisma/client";
import { NewArticleComment } from "./article.comment.entity";

export type PersistNotificationEntity = NotificationEntity & {
    id: string;
    createdAt: Date;
}


export type NewNotificationEntity = Omit<NotificationEntity, 'id' | 'createdAt'>;

export class NotificationEntity {
    private readonly _id?: string;
    private _type: NotificationType;
    private _message: string;
    private _read: boolean;
    private _senderId: string
    private _receiverId: string
    private readonly _createdAt?: Date;

    private constructor(params: {
        id?: string;
        type: NotificationType;
        message: string;
        read: boolean;
        senderId: string
        receiverId: string
        createdAt?: Date;
    }) {
        this._id = params.id;
        this._type = params.type;
        this._message = params.message;
        this._read = params.read;
        this._senderId = params.senderId;
        this._receiverId = params.receiverId;
        this._createdAt = params.createdAt;
    }

    static createNew(params: {
        type: NotificationType;
        message: string;
        read: boolean;
        senderId: string
        receiverId: string
    }) {
        return new NotificationEntity({
            type: params.type,
            message: params.message,
            read: params.read,
            senderId: params.senderId,
            receiverId: params.receiverId,
        }) as NewNotificationEntity;
    }

    static createPersist(params: {
        id: string;
        type: NotificationType;
        message: string;
        read: boolean;
        senderId: string
        receiverId: string
        createdAt: Date;
    }) {
        return new NotificationEntity({
            id: params.id,
            type: params.type,
            message: params.message,
            read: params.read,
            senderId: params.senderId,
            receiverId: params.receiverId,
            createdAt: params.createdAt
        }) as PersistNotificationEntity
    }

    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
    get message() {
        return this._message;
    }
    get read() {
        return this._read;
    }
    get receiverId() {
        return this._receiverId;
    }
    get senderId() {
        return this._senderId;
    }

    get createdAt() {
        return this._createdAt;
    }
}