import { ArticleRequest } from '../../02-controller/req-validator/req.validator';
import { ArticleResDto } from '../../02-controller/res-dto/article.res.dto';
import { Exception } from '../../common/exception/exception';

export class Article {

    #id
    #title
    #content
    #createdAt
    #updatedAt
    #userId



    constructor({ id, title, content, userId, createdAt, updatedAt }:
        {
            id: string,
            title: string,
            content: string,
            userId: string,
            createdAt: Date,
            updatedAt: Date
        }
    ) {
        this.#id = id;
        this.#title = title;
        this.#content = content;
        this.#createdAt = createdAt;
        this.#updatedAt = updatedAt;
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


    static forCreate(dto: ArticleResDto) {
        const { id, title, content, userId, createdAt, updatedAt } = dto;

        this.validateTitle(title);
        this.validateContent(content);

        return new Article({ id, title, content, userId, createdAt, updatedAt });
    }

    static validateTitle(title: string) {
        if (!title) {
            throw new Exception("제목을 입력해주세요", 400);
        }
    }

    static validateContent(content: string) {
        if (!content) {
            throw new Exception("내용을 입력해주세요", 400);
        }
    }
}