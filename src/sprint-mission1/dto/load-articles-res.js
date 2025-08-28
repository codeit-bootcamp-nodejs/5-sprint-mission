export default class LoadArticlesRes {
  #articles;

  constructor(articles) {
    this.#articles = articles;
  }

  get articles() {
    return this.#articles;
  }
}
