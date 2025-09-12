export default class Product {
  #id; // id
  #name; // 상품명
  #description; // 상품 설명
  #price; // 판매 가격
  #tags; // 해시태그 배열
  #images; // 이미지 배열
  #createdAt; // 만들어진 시간
  #updatedAt; // 수정된 시간
  _favoriteCount; // 찜하기 수

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
    this._favoriteCount = favoriteCount;
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
    return this._favoriteCount;
  }

  favorite() {
    this._favoriteCount++;
  }

  set favoriteCount(count) {
    this._favoriteCount = count;
  }
}
