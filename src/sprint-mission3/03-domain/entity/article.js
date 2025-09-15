import { Exception } from "../../common/exception.js";

export class Article {
  #id;
  #title;
  #content;
  #createdAt;
  #updatedAt;

  constructor({ id = undefined, title = undefined, content = undefined, createdAt = undefined, updatedAt = undefined }) {
    this.#id = id;
    this.#title = title;
    this.#content = content;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  static createFactory = ({ title, content }) => {
    this.validateTitleRule(title);
    this.validateContentRule(content);
    return new Article({ title, content });
  }
  static updateFactory = ({ id, title, content }) => {
    if (title !== undefined) {
      this.validateTitleRule(title);
    }
    if (content !== undefined) {
      this.validateContentRule(content);
    }
    return new Article({ id, title, content });
  }
  static deleteFactory = ({ id, title }) => {
    if (title !== undefined) {
      this.validateTitleRule(title);
    }
    return new Article({ id, title });
  }

  static validateTitleRule = (title) => {
    if (title.length > 20) {
      throw new Exception("TITLE_TOO_LONG");
    }
  }
  static validateContentRule = (content) => {
    if (content.length < 5) {
      throw new Exception("CONTENT_TOO_SHORT");
    }
  }

  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }
  get content() {
    return this.#content;
  }
  get createdAt() {
    return this.#createdAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }
  
}