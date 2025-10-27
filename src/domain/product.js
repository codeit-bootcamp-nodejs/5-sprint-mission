export class Product {
  _name;
  _description;
  _price;
  _tags;
  _images;
  _favoriteCount;

  constructor({
    name,
    description,
    price,
    tags = [],
    images = [],
    favoriteCount = 0,
  }) {
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = Array.from(tags);
    this._images = Array.from(images);
    this._favoriteCount = favoriteCount;
  }

  getName() {
    return this._name;
  }

  getDescription() {
    return this._description;
  }

  getPrice() {
    return this._price;
  }

  getTags() {
    return Array.from(this._tags);
  }

  getImages() {
    return Array.from(this._images);
  }

  getFavoriteCount() {
    return this._favoriteCount;
  }

  favorite() {
    this._favoriteCount++;
  }
}
