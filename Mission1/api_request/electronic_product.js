import Product from "./product.js";

export default class ElectronicProduct extends Product {
  #manufacturer;

  constructor(manufacturer, name, description, price, tags, images, favoriteCount = 0) {
    super(name, description, price, tags, images, favoriteCount);
    this.#manufacturer = manufacturer;
  }

  get manufacturer() { 
    return this.#manufacturer; 
  }
}