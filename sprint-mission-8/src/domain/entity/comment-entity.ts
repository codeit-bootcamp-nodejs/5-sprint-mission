type CommentAttrs = {
  id?: number;
  userId?: number;
  productId?: number | null;
  articleId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  content: string;
};

export type NewCommentAttrs = Pick<CommentAttrs, "content"> & {
  userId?: number;
  productId?: number;
  articleId?: number;
};

export type EditCommentAttrs = Partial<Pick<CommentAttrs, "content">>;

export type PersistedCommentRecord = Required<
  Pick<CommentAttrs, "id" | "userId" | "createdAt" | "updatedAt">
> &
  Pick<CommentAttrs, "content" | "productId" | "articleId">;

export type PersistedCommentEntity = CommentEntity;

export class CommentEntity {
  private readonly _id?: number;
  private readonly _userId?: number;
  private readonly _productId?: number | null;
  private readonly _articleId?: number | null;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private _content: string;

  constructor(attrs: CommentAttrs) {
    this._id = attrs.id;
    this._userId = attrs.userId;
    this._productId = attrs.productId;
    this._articleId = attrs.articleId;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
    this._content = attrs.content ?? "";
  }

  static createNew(attrs: NewCommentAttrs): CommentEntity {
    return new CommentEntity(attrs);
  }

  static fromPersisted(record: PersistedCommentRecord): CommentEntity {
    return new CommentEntity(record);
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get productId() {
    return this._productId;
  }

  get articleId() {
    return this._articleId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get content() {
    return this._content;
  }
}
