import { Exception } from '../../common/exception/exception';


export type PersistArticleEntity = Article & {
    id: string,
    createdAt: Date,
    updatedAt: Date
}

export type NewArticleEntity = Omit<
    Article,
    'id' | 'createdAt' | 'updatedAt'>;



export class Article {

    private readonly _id?: string
    private _title: string
    private _content: string
    private readonly _userId: string
    private readonly _createdAt?: Date
    private readonly _updatedAt?: Date



    private constructor(params: {
        id?: string,
        title: string,
        content: string,
        userId: string,
        createdAt?: Date,
        updatedAt?: Date
    }) {
        this._id = params.id;
        this._title = params.title;
        this._content = params.content;
        this._userId = params.userId;
        this._createdAt = params.createdAt;
        this._updatedAt = params.updatedAt;
    }


    static createPersist(params: {
        id: string,
        title: string,
        content: string,
        userId: string,
        createdAt: Date,
        updatedAt: Date
    }) {
        return new Article({
            id: params.id,
            title: params.title,
            content: params.content,
            userId: params.userId,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt
        }) as PersistArticleEntity;
    }

    static createNew(params: {
        title: string,
        content: string,
        userId: string
    }) {
        return new Article({
            title: params.title,
            content: params.content,
            userId: params.userId
        }) as NewArticleEntity;
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

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
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