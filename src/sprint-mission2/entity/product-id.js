export default class ProductId {
  #id;

  constructor(id) {
    this.#id = id;
  }

  get Id() {
    return this.#id;
  }
}
