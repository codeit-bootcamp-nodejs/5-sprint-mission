import { PersistArticleEntity } from "../article.entity";
import { BaseEntity } from "../base.entity";

export type NewProductImageEntity = Omit<ProductImageEntity, 'id' | 'createdAt' | 'updatedAt'>;

export interface PersistProductImageEntity extends ProductImageEntity {
  id: number;
  createdAt: Date;
}

export class ProductImageEntity extends BaseEntity<number> {
  private readonly _productId: string;
  private readonly _url: string;

  constructor(attributes: {
    id?: number;
    productId: string;
    url: string;
    createdAt?: Date;
  }) {
    super(
      attributes.id,
      attributes.createdAt,
    );
    this._productId = attributes.productId;
    this._url = attributes.url;
  }

  get productId() {
    return this._productId;
  }
  get user() {
    return this._url;
  }

  static createNew(params: {
    productId: string;
    url: string;
  }): NewProductImageEntity {
    return new ProductImageEntity(params) as NewProductImageEntity
  }

  static createPersist(params: {
    id: number;
    productId: string;
    url: string;
    createdAt: Date;
  }): PersistProductImageEntity {
    return new ProductImageEntity(params) as PersistProductImageEntity
  }
}