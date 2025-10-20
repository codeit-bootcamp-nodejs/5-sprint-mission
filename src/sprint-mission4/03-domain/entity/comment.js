import { Exception } from "../../common/const/exception.js";
import { BaseEntity } from "./baseEntity.js";

export class Comment extends BaseEntity {
  #articleId;
  #productId;
  #content;

  constructor({ id, articleId = undefined, productId = undefined, content, createdAt, updatedAt }) {
    super({ id, createdAt, updatedAt });
    this.#content = content;
    this.#articleId = articleId;
    this.#productId = productId;
  }

  static factory = ({ articleId, productId, id, content }) => {
    if (content !== undefined) {
      this.validateContentRule(content);
    }
    return new Comment({articleId, productId, id, content });
  };

  static validateContentRule = (content) => {
    if (content.length < 5) {
      throw new Exception("CONTENT_TOO_SHORT");
    }
  };

  get content() {
    return this.#content;
  }
  get articleId() {
    return this.#articleId;
  }
  get productId() {
    return this.#productId;
  }
}
