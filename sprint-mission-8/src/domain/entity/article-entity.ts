type ArticleAttrs = {
  id?: number;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  content: string;
  image?: string | null;
};

export type NewArticleAttrs = Pick<ArticleAttrs, "title" | "content" | "image">;

export type EditArticleAttrs = Partial<
  Pick<ArticleAttrs, "title" | "content" | "image">
>;

export type PersistedArticleRecord = Required<
  Pick<ArticleAttrs, "id" | "userId" | "createdAt" | "updatedAt">
> &
  Pick<ArticleAttrs, "title" | "content" | "image">;

export type PersistedArticleEntity = ArticleEntity;

export class ArticleEntity {
  private readonly _id?: number;
  private readonly _userId?: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private _title: string;
  private _content: string;
  private _image?: string | null;

  constructor(attrs: ArticleAttrs) {
    this._id = attrs.id;
    this._userId = attrs.userId;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
    this._title = attrs.title;
    this._content = attrs.content;
    this._image = attrs.image;
  }

  static createNew(
    attrs: NewArticleAttrs & { userId?: number },
  ): ArticleEntity {
    return new ArticleEntity(attrs);
  }

  static fromPersisted(record: PersistedArticleRecord): ArticleEntity {
    return new ArticleEntity(record);
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get title() {
    return this._title;
  }

  get content() {
    return this._content;
  }

  get image() {
    return this._image;
  }
}
