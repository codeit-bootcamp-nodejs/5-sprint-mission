export class UserLikesProductEntity {
  private readonly _userId: string;
  private readonly _productId: string;

  constructor(attributes: {
    userId: string;
    productId: string;
  }) {
    this._userId = attributes.userId;
    this._productId = attributes.productId;
  }

  get userId() {
    return this._userId;
  }
  get productId() {
    return this._productId;
  }

  static createNew(params: {
    userId: string;
    productId: string;
  }): UserLikesProductEntity {
    return new UserLikesProductEntity(params) as UserLikesProductEntity;
  }
  static createPersist(params: {
    userId: string;
    productId: string;
  }): UserLikesProductEntity {
    return new UserLikesProductEntity(params) as UserLikesProductEntity;
  }
}