import { v4 as uuidv4 } from 'uuid';
import { Exception } from '../../common/exception/exception.js';

export class Article {
    #id
    #title
    #content
    #createdAt
    #updatedAt


    constructor({ id = uuidv4(), title, content }) {
        this.#id = id;
        this.#title = title;
        this.#content = content;
        this.#createdAt = new Date();
        this.#updatedAt = new Date();
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


    static forCreate({ id, title, content }) {
        this.validateTitle(title);
        this.validateContent(content);

        return new Article({ id, title, content });
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