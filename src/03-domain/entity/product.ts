import { ProductResDto } from '../../02-controller/res-dto/product.res.dto';
import { Exception } from '../../common/exception/exception';


export class Product {
    private _id;
    private _name;
    private _description;
    private _price;
    private _tags;
    private _createdAt;
    private _updatedAt;
    private _userId;
    private _isLiked;
    private _imageUrl;

    constructor({
        id,
        name,
        description,
        price,
        tags,
        userId,
        isLiked,
        imageUrl,
    }: {
        id: string;
        name: string;
        description: string;
        price: number;
        tags: string[];
        userId: string;
        isLiked?: boolean | false;
        imageUrl?: string | "";
    }) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._price = price;
        this._tags = tags;
        this._createdAt = new Date();
        this._updatedAt = new Date();
        this._userId = userId;
        this._isLiked = isLiked ?? false;
        this._imageUrl = imageUrl ?? "";
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

    static forCreate(dto: ProductResDto) {
        const { id, name, description, price, tags, userId } = dto;

        this.validateName(name);
        this.validateDescription(description);
        this.validatePrice(price);
        this.validateTags(tags);

        return new Product({ id, name, description, price, tags, userId });
    }

    static validateName(name: string) {
        if (!name) throw new Exception("상품명을 입력해주세요", 400);
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
