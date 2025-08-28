export default class LoadProductsRes {
  #products;

  constructor(products) {
    this.#products = products;
  }

  get products() {
    return this.#products;
  }
}
