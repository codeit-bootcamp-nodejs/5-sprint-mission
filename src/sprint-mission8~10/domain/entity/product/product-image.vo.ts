export class ProductImageVo{
  private readonly _url: string;

  constructor(attributes: {
    url: string;
  }) {
    this._url = attributes.url;
  }

  get url() {
    return this._url;
  }

  static create(params: {
    url: string;
  }): ProductImageVo {
    return new ProductImageVo(params) as ProductImageVo
  }
}