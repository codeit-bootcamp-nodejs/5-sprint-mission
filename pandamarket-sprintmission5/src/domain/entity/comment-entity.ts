export interface CommentParams {
  id?: number;
  content: string;
  userId: number;
  productId?: number | null;
  articleId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PersistedCommentEntity = Required<CommentEntity>;

export class CommentEntity {
  public id;
  public content;
  public userId;
  public productId;
  public articleId;
  public createdAt;
  public updatedAt;

  constructor(params: CommentParams) {
    this.id = params.id;
    this.content = params.content;
    this.userId = params.userId;
    this.productId = params.productId ?? null;
    this.articleId = params.articleId ?? null;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}

