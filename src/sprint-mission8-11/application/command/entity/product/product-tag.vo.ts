export class ProductTagVo {
  private readonly _name: string;
  private readonly _tagId: number;
  constructor(attributes: { tagId: number; name: string }) {
    this._tagId = attributes.tagId;
    this._name = attributes.name;
  }

  get tagId() {
    return this._tagId;
  }
  get name() {
    return this._name;
  }

  static create(params: { tagId: number; name: string }): ProductTagVo {
    return new ProductTagVo(params);
  }
}
