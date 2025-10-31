

type ArticleCommentParams = {
    id?: string;
    articleId?: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
}


export type PersistedArticleComment = ArticleComment & { 
    id : string
}


export class ArticleComment {
    private _id;
    private _articleId;
    private _content;
    private _createdAt;
    private _updatedAt;
    private _userId;

    constructor({ id, articleId, content, createdAt, updatedAt, userId }: ArticleCommentParams) {
        this._id = id;
        this._articleId = articleId;
        this._content = content;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._userId = userId;
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
