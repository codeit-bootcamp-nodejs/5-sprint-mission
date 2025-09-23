export default class LoadProductRes {
  #id;
  #name;
  #description;
  #price;
  #tags;
  #images;
  #createdAt;
  #updatedAt;
  #favoriteCount;

  constructor(
    id,
    name,
    description,
    price,
    tags = [],
    images = [],
    createdAt,
    updatedAt,
    favoriteCount = 0,
  ) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#images = images;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#favoriteCount = favoriteCount;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }
  get id() {
    return this.#id;
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

  set favoriteCount(count) {
    this.#favoriteCount = count;
  }
}
