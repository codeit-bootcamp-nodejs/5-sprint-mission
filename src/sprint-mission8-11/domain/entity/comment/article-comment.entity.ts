import { BusinessExceptionType } from "../../../shared/const/business.exception.info";
import { BusinessException } from "../../../shared/exceptions/business.exception";
import { BaseEntity } from "../base.entity";

export type NewArticleCommentEntity = Omit<
  ArticleCommentEntity,
  "id" | "createdAt" | "updatedAt"
>;

export interface PersitstArticleCommentEntity extends ArticleCommentEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ArticleCommentEntity extends BaseEntity<number> {
  private readonly _userId: string; // 댓글 작성자
  private readonly _articleUserId?: string; // 게시글 작성자
  private readonly _articleId: string;
  private _content: string;

  constructor(attributes: {
    id?: number;
    userId: string;
    articleUserId?: string;
    articleId: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(attributes.id, attributes.createdAt, attributes.updatedAt);
    this._userId = attributes.userId;
    this._articleUserId = attributes.articleUserId;
    this._content = attributes.content;
    this._articleId = attributes.articleId;
  }

  static createNew(parmas: {
    userId: string;
    articleId: string;
    content: string;
  }): NewArticleCommentEntity {
    if (parmas.content) {
      this.validateContentRule(parmas.content);
    }
    return new ArticleCommentEntity(parmas) as NewArticleCommentEntity;
  }

  static createPersist(parmas: {
    id: number;
    userId: string;
    articleUserId?: string;
    articleId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }): PersitstArticleCommentEntity {
    return new ArticleCommentEntity(parmas) as PersitstArticleCommentEntity;
  }

  updateContent(content: string) {
    ArticleCommentEntity.validateContentRule(content);
    this._content = content;
  }

  static validateContentRule = (content: string) => {
    if (content.length < 5) {
      throw new BusinessException({
        type: BusinessExceptionType.CONTENT_TOO_SHORT,
      });
    }
  };

  get userId() {
    return this._userId;
  }
  get articleUserId() {
    return this._articleUserId;
  }
  get content() {
    return this._content;
  }
  get articleId() {
    return this._articleId;
  }
}
