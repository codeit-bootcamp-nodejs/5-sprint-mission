export default class Product {
  #name;
  #description;
  #price;
  #tags;
  #images;
  #favoriteCount;

  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#favoriteCount = favoriteCount;
  }

  favorite () {
    this.#favoriteCount += 1;
    return this.#favoriteCount;
  }

  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get price() {
    return this.#price;
  }
  get tags() {
    return this.#tags;
  }
  get images() {
    return this.#images;
  }
  get favoriteCount() {
    return this.#favoriteCount;
  }
}