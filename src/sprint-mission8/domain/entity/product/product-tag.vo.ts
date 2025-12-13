export class ProductTagVo {
  private readonly _productId: string;
  private readonly _tagId: number
  constructor(attributes: {
    productId: string;
    tagId: number;
  }) {
    this._productId = attributes.productId;
    this._tagId = attributes.tagId
  }

  get tagId() {
    return this._tagId;
  }
  get productId() {
    return this._productId;
  }

  static create(params: {
    productId: string;
    tagId: number;
  }): ProductTagVo {
    return new ProductTagVo(params);
  }
}