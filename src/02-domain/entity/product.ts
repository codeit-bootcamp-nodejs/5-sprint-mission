import { Exception } from '../../common/exception/exception';


export type PersistedProduct = Product & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type NewProduct = Omit<PersistedProduct, 'id' | 'createdAt' | 'updatedAt'>;


export class Product {
    private readonly _id?: string;
    private _name: string;
    private _description: string;
    private _price: number;
    private _tags: string[];
    private _userId: string;
    private _isLiked: boolean;
    private _imageUrl?: string;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;

    constructor(params: {
        id?: string,
        name: string,
        description: string,
        price: number,
        tags: string[],
        userId: string,
        isLiked?: boolean,
        imageUrl?: string,
        createdAt?: Date,
        updatedAt?: Date,
    }) {
        this._id = params.id;
        this._name = params.name;
        this._description = params.description;
        this._price = params.price;
        this._tags = params.tags;
        this._userId = params.userId;
        this._isLiked = params.isLiked || false;
        this._imageUrl = params.imageUrl;
    }


    get id() { return this._id; }
    get name() { return this._name; }
    get description() { return this._description; }
    get price() { return this._price; }
    get tags() { return this._tags; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get userId() { return this._userId; }
    get isLiked() { return this._isLiked; }
    get imageUrl() { return this._imageUrl; }

    like() {
        this._isLiked = true;
    }

    unlike(){
        this._isLiked = false;
    }

    static createNew(params: {
        name: string,
        description: string,
        price: number,
        tags: string[],
        userId: string,
        imageUrl?: string,
    }) {
        this.validateDescription(params.description);
        this.validatePrice(params.price);
        this.validateTags(params.tags);
        return new Product({
            name: params.name,
            description: params.description,
            price: params.price,
            tags: params.tags,
            userId: params.userId,
            imageUrl: params.imageUrl,
        });
    }

    static createPersisted(params: {
        id: string,
        name: string,
        description: string,
        price: number,
        tags: string[],
        userId: string,
        isLiked: boolean,
        createdAt: Date,
        updatedAt: Date,
    }) {

        return new Product({
            id: params.id,
            name: params.name,
            description: params.description,
            price: params.price,
            tags: params.tags,
            userId: params.userId,
            isLiked: params.isLiked,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt,
        }) as PersistedProduct;
    }

    static validateDescription(description: string) {
        if (!description) throw new Exception("상품 설명을 입력해주세요.", 400);
    }

    static validatePrice(price: number) {
        if (!price) throw new Exception("상품 가격을 입력해주세요.", 400);
    }

    static validateTags(tags: string[]) {
        const allowedTags = ["Apparel", "Electronics", "Home_Goods", "Luxury_Goods", "Collectibles"];
        if (!tags || !Array.isArray(tags) || tags.length === 0)
            throw new Exception("상품 태그를 입력해주세요.", 400);

        const invalidTags = tags.filter(tag => !allowedTags.includes(tag));
        if (invalidTags.length > 0)
            throw new Exception(`유효하지 않은 태그가 포함되어 있습니다: ${invalidTags.join(", ")}`, 400);
    }
}
