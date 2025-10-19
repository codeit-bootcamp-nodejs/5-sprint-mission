import { Exception } from "../../common/const/exception.js";
import { BaseEntity } from "./baseEntity.js";

export class Article extends BaseEntity {
  #title;
  #content;

  constructor({
    id = undefined,
    title = undefined,
    content = undefined,
    createdAt = undefined,
    updatedAt = undefined,
  }) {
    super({ id, createdAt, updatedAt });
    this.#title = title;
    this.#content = content;
  }

  static createFactory = ({ title, content }) => {
    this.validateTitleRule(title);
    this.validateContentRule(content);
    return new Article({ title, content });
  };
  static updateFactory = ({ id, title, content }) => {
    if (title !== undefined) {
      this.validateTitleRule(title);
    }
    if (content !== undefined) {
      this.validateContentRule(content);
    }
    return new Article({ id, title, content });
  };
  static deleteFactory = ({ id, title }) => {
    if (title !== undefined) {
      this.validateTitleRule(title);
    }
    return new Article({ id, title });
  };

  static validateTitleRule = (title) => {
    if (title.length > 20) {
      throw new Exception("TITLE_TOO_LONG");
    }
  };
  static validateContentRule = (content) => {
    if (content.length < 5) {
      throw new Exception("CONTENT_TOO_SHORT");
    }
  };

  get title() {
    return this.#title;
  }
  get content() {
    return this.#content;
  }
}
