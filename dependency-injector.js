import { Server } from "./src/server/server.js";
import * as ProductService from "./src/services/product.service.js";
import * as ArticleService from "./src/services/article.service.js";

export class DependencyInjector {
  #server;
  constructor() {
    this.#server = this.inject();
  }

  inject() {
    const controllers = [];

    const server = new Server(controllers);
    return server;
  }

  get server() {
    return this.#server;
  }
}
