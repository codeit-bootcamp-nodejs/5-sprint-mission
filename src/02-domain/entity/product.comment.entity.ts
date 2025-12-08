type ProductCommentParams = {
    id?: string;
    productId?: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
}


export type PersistedProductComment = ProductComment & { 
    id : string
}


export class ProductComment {
    private _id;
    private _productId;
    private _content;
    private _createdAt;
    private _updatedAt;
    private _userId;

    constructor({ id, productId, content, createdAt, updatedAt, userId }: ProductCommentParams) {
        this._id = id;
        this._productId = productId;
        this._content = content;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._userId = userId;
    }

    get id() {
        return this._id;
    }

    get productId() {
        return this._productId;
    }

    get content() {
        return this._content;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get userId() {
        return this._userId;
    }



}
