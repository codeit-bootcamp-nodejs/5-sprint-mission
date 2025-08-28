import Product from "./product.js";

export default class ElectronicProduct extends Product {
  #manufacturer;

  constructor(
    id,
    name,
    description,
    price,
    tags = [],
    images = [],
    createdAt,
    updatedAt,
    _favoriteCount = 0,
  ) {
    super(
      id,
      name,
      description,
      price,
      tags,
      images,
      createdAt,
      updatedAt,
      _favoriteCount,
    );
    this.#manufacturer = this.tags;
  }

  get manufacturer() {
    return this.#manufacturer;
  }
}
