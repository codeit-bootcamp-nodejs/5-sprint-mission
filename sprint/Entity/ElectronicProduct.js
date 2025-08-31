import Product from "./Product.js";

export default class ElectronicProduct extends Product {
  #manufacturer;

  constructor(name, description, price, tags, images, manufacturer){
    super(name, description, price, tags, images);
    this.#manufacturer = manufacturer;
  }
}