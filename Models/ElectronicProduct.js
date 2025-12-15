import Product from "./Product.js";

export default class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, favoriteCount = 0, manufacturer = "") {
    super(name, description, price, tags, images, favoriteCount); // 부모 생성자 호출
    this.manufacturer = manufacturer; // 제조사
  }

  toString() {
    return `${super.toString()} | 제조사: ${this.manufacturer}`;
  }
}
