import { BaseEntity } from "../base.entity";

export interface CommentParams extends BaseParams<number> {
  userId: string;
  articleId?: string;
  productId?: string;
  content: string;
}
export interface PersistedCommentEntity extends CommentEntity{
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentFactoryType = {
  commentId?: number;
  userId: string;
  articleId?: string;
  productId?: string;
  content: string,
}

export class CommentEntity extends BaseEntity<number> {
  private _userId;
  private _articleId;
  private _productId;
  private _content;

  constructor({
    id,
    userId,
    articleId,
    productId,
    content,
    createdAt,
    updatedAt,
  }: CommentParams) {
    super({ id, createdAt, updatedAt });
    this._userId = userId;
    this._content = content;
    this._articleId = articleId;
    this._productId = productId;
  }

  static factory = ({
    commentId: id,
    userId,
    articleId,
    productId,
    content,
  }: CommentFactoryType) => {
    if (content !== undefined) {
      this.validateContentRule(content);
    }
    return new CommentEntity({ id, userId, articleId, productId, content });
  };

  static validateContentRule = (content: string) => {
    if (content.length < 5) {
      throw new Exception({info: EXCEPTIONS.CONTENT_TOO_SHORT});
    }
  };

  get userId() {
    return this._userId;
  }
  get content() {
    return this._content;
  }
  get articleId() {
    return this._articleId;
  }
  get productId() {
    return this._productId;
  }
}
