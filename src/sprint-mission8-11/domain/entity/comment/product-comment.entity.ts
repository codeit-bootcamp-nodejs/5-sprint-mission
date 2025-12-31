import { BusinessExceptionType } from "../../../shared/const/business.exception.info";
import { BusinessException } from "../../../shared/exceptions/business.exception";
import { BaseEntity } from "../base.entity";

export type NewProductCommentEntity = Omit<
  ProductCommentEntity,
  "id" | "createdAt" | "updatedAt"
>;

export interface PersitstProductCommentEntity extends ProductCommentEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductCommentEntity extends BaseEntity<number> {
  private readonly _userId: string; // 댓글 작성자
  private readonly _productId: string;
  private _content: string;

  constructor(attributes: {
    id?: number;
    userId: string;
    productId: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(attributes.id, attributes.createdAt, attributes.updatedAt);
    this._userId = attributes.userId;
    this._content = attributes.content;
    this._productId = attributes.productId;
  }

  static createNew(parmas: {
    userId: string;
    productId: string;
    content: string;
  }): NewProductCommentEntity {
    if (parmas.content) {
      this.validateContentRule(parmas.content);
    }
    return new ProductCommentEntity(parmas) as NewProductCommentEntity;
  }

  static createPersist(parmas: {
    id: number;
    userId: string;
    productId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }): PersitstProductCommentEntity {
    return new ProductCommentEntity(parmas) as PersitstProductCommentEntity;
  }

  updateContent(content: string) {
    ProductCommentEntity.validateContentRule(content);
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
  get content() {
    return this._content;
  }
  get productId() {
    return this._productId;
  }
}
