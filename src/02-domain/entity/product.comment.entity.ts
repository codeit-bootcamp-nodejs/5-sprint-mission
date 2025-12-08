export type NewProductComment = Omit<ProductComment, 'id' | 'createdAt' | 'updatedAt'>;


export type PersistedProductComment = ProductComment & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}


export class ProductComment {
    private _id?;
    private _productId;
    private _content;
    private _createdAt?;
    private _updatedAt?;
    private _userId;

    private constructor(params: {
        id?: string;
        productId: string;
        content: string;
        createdAt?: Date;
        updatedAt?: Date;
        userId: string;
    }) {
        this._id = params.id;
        this._productId = params.productId;
        this._content = params.content;
        this._createdAt = params.createdAt;
        this._updatedAt = params.updatedAt;
        this._userId = params.userId;
    }

    static createNew(params: {
        productId: string;
        content: string;
        userId: string;
    }) {
        return new ProductComment({
            productId: params.productId,
            content: params.content,
            userId: params.userId,
        }) as NewProductComment;
    }


    static createPersist(params : {
        id: string;
        productId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }) { 
        return new ProductComment({
            id: params.id,
            productId: params.productId,
            content: params.content,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt,
            userId: params.userId,
        }) as PersistedProductComment;
    }

    update(content: string) {
        this._content = content;
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
