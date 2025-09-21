import { v4 as uuidv4 } from 'uuid';
import { Exception } from '../../common/exception/exception.js';

export class Comment {
    #id
    #content
    #createdAt
    #updatedAt
    #articleId
    #productId

    constructor({ id = uuidv4(), content, articleId = "", productId = "" }) {
        this.#id = id;
        this.#content = content;
        this.#articleId = articleId;
        this.#productId = productId;
        this.#createdAt = new Date();
        this.#updatedAt = new Date();
    }

    get id() {
        return this.#id;
    }

    get content() {
        return this.#content;
    }

    get createdAt() {
        return this.#createdAt;
    }

    get updatedAt() {
        return this.#updatedAt;
    }

    get articleId() {
        return this.#articleId;
    }

    get productId() {
        return this.#productId;
    }

    static forCreate({ id, content, params = {} }) {
        this.validateContent(content);

        const { productId = null, articleId = null } = params;

        return new Comment({ id, content, productId, articleId });

    }

    static validateContent(content) {
        if (!content) {
            throw new Exception("내용을 입력해주세요", 400);
        }
    }
}