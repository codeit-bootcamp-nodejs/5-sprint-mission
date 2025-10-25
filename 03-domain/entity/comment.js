import { v4 as uuidv4 } from 'uuid';
import { Exception } from '../../common/exception/exception.js';

export class Comment {
    #id
    #content
    #createdAt
    #updatedAt
    #articleId
    #productId
    #userId

    constructor({ id, content, userId, productId, articleId, createdAt, updatedAt }) {
        this.#id = id;
        this.#content = content;
        this.#articleId = articleId;
        this.#productId = productId;
        this.#createdAt = createdAt;
        this.#updatedAt = updatedAt;
        this.#userId = userId;
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

    get userId() {
        return this.#userId;
    }

    static forCreate({ id, content, userId, productId, articleId, createdAt, updatedAt }) {
        this.validateContent(content);

        return new Comment({ id, content, userId, productId, articleId, createdAt, updatedAt });

    }

    static validateContent(content) {
        if (!content) {
            throw new Exception("내용을 입력해주세요", 400);
        }
    }
}