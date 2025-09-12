import { Server } from "./sprint-mission3/01-app/server.js";

export class DepInjector {
  #_sever;

  constructor() {
    this.#_sever = this.injectDeps();
  }
  
  get _server() {
    return this.#_sever;
  }

  injectDeps() {
    return new Server();
  }
}