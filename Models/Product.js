export default class Product {
  #favoriteCount = 0;

  constructor(name, description, price, tags = [], images = []) {
    this.name = name; // 상품명
    this.description = description; // 상품 설명
    this.price = price; // 판매 가격
    this.tags = tags; // 태그 배열
    this.images = images; // 이미지 배열
  }

  // 찜하기 수 확인 
  get favoriteCount() {
    return this.#favoriteCount;
  }

  // 찜하기 기능
  favorite() {
    this.#favoriteCount += 1;
  }

  toString() {
    return `${this.name} - ${this.price}원 (찜 ${this.#favoriteCount}개)`;
  }
}
