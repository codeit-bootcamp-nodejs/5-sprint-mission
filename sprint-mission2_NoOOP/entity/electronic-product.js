import Product from "./product.js";

export default class ElectronicProduct extends Product {
  #manufacturer; // response에 제조사 정보가 없어서 생성자에 추가하지 않았습니다.

  constructor(name, description, price, tags, images) {
    super(name, description, price, tags, images);
  }
}
