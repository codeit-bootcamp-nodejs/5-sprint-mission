export class comment {
  #content
  constructor(content){
    this.#content = content;
  }

  get content() {
    return this.#content;
  }
}