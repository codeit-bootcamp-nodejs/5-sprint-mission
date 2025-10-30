import { v4 as uuidv4 } from 'uuid';
import { Exception } from '../../common/exception/exception.js';

export class Article {
    #id
    #title
    #content
    #createdAt
    #updatedAt
    #userId
    


    constructor({ id = uuidv4(), title, content, userId }) {
        this.#id = id;
        this.#title = title;
        this.#content = content;
        this.#createdAt = new Date();
        this.#updatedAt = new Date();
        this.#userId = userId;
    }

    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
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

    get userId() {
        return this.#userId;
    }


    static forCreate({ id, title, content, userId}) {
        this.validateTitle(title);
        this.validateContent(content);

        return new Article({ id, title, content, userId });
    }

    static validateTitle(title) {
        if (!title) {
            throw new Exception("제목을 입력해주세요", 400);
        }
    }

    static validateContent(content) {
        if (!content) {
            throw new Exception("내용을 입력해주세요", 400);
        }
    }
}