import { NotificationType } from "@prisma/client";
import { omit } from "zod/v4/core/util.cjs";

export type PersistNotificationEntity = NotificationEntity & { 
    id : string;
    createdAt: Date;
}


export type NewNotificationEntity = Omit<NotificationEntity, 'id' | 'createdAt'>;

export class NotificationEntity {
    private readonly _id?: string;
    private readonly _type: NotificationType;
    private readonly _message: string;
    private readonly _read: boolean;
    private readonly _userId: string;
    private readonly _createdAt?: Date;

    constructor(params:{
        id?: string;
        type: NotificationType;
        message: string;
        read: boolean;
        userId: string;
        createdAt?: Date;
    }){
        this._id = params.id;
        this._type = params.type;
        this._message = params.message;
        this._read = params.read;
        this._userId = params.userId;
        this._createdAt = params.createdAt;
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
    get userId() {
        return this._userId;
    }
    get createdAt() {
        return this._createdAt;
    }
}