import { v4 as uuidv4 } from 'uuid';
import { Exception } from '../../common/exception/exception.js';

export class Product {

    #id
    #name
    #description
    #price
    #tags
    #createdAt
    #updatedAt

    constructor({ id = uuidv4(), name, description, price, tags }) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#price = price;
        this.#tags = tags;
        this.#createdAt = new Date();
        this.#updatedAt = new Date();
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get price() {
        return this.#price;
    }

    get tags() {
        return this.#tags;
    }

    get createdAt() {
        return this.#createdAt;
    }

    get updatedAt() {
        return this.#updatedAt;
    }

    static forCreate({ id, name, description, price, tags }) {
        this.validateName(name);
        this.validateDescription(description);
        this.validatePrice(price);
        this.validateTags(tags);

        return new Product({ id, name, description, price, tags });
    }


    static validateName(name) {
        if (!name) {
            throw new Exception("상품명을 입력해주세요", 400);
        }
    }

    static validateDescription(description) {
        if (!description) {
            throw new Exception("상품 설명을 입력해주세요.", 400);
        }
    }

    static validatePrice(price) {
        if (!price) {
            throw new Exception("상품 가격을 입력해주세요.", 400);
        }
    }

    static validateTags(tags) {
        const allowedTags = [
            "Apparel",
            "Electronics",
            "Home_Goods",
            "Luxury_Goods",
            "Collectibles"
        ];

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            throw new Exception("상품 태그를 입력해주세요.", 400);
        }

        const invalidTags = tags.filter(tag => !allowedTags.includes(tag));
        if (invalidTags.length > 0) {
            throw new Exception(`유효하지 않은 태그가 포함되어 있습니다: ${invalidTags.join(", ")}`, 400);
        }
    }

}