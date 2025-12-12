

export type NewArticleComment = Omit<ArticleComment, 'id' | 'createdAt' | 'updatedAt'>;


export type PersistedArticleComment = ArticleComment & {
    id: string
}


export class ArticleComment {
    private readonly _id?;
    private readonly _articleId?;
    private _content;
    private readonly _userId;
    private readonly _createdAt?;
    private readonly _updatedAt?;

    private constructor(params: {
        id?: string;
        articleId?: string;
        content: string;
        createdAt?: Date;
        updatedAt?: Date;
        userId: string;
    }) {
        this._id = params.id;
        this._articleId = params.articleId;
        this._content = params.content;
        this._createdAt = params.createdAt;
        this._updatedAt = params.updatedAt;
        this._userId = params.userId;
    }

    static createNew(params: {
        articleId: string;
        content: string;
        userId: string;
    }) {
        return new ArticleComment({
            articleId: params.articleId,
            content: params.content,
            userId: params.userId,
        }) as NewArticleComment;
    }


    static createPersisted(params: {
        id: string;
        articleId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }) {
        return new ArticleComment({
            id: params.id,
            articleId: params.articleId,
            content: params.content,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt,
            userId: params.userId,
        }) as PersistedArticleComment;
    }

    get id() {
        return this._id;
    }

    get articleId() {
        return this._articleId;
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
