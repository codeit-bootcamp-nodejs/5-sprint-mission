import { Exception } from "../../common/const/exception.js";
import { BaseEntity } from "./baseEntity.js";

export class Comment extends BaseEntity {
  #userId;
  #articleId;
  #productId;
  #content;

  constructor({ id, userId, articleId = undefined, productId = undefined, content, createdAt, updatedAt }) {
    super({ id, createdAt, updatedAt });
    this.#userId = userId;
    this.#content = content;
    this.#articleId = articleId;
    this.#productId = productId;
  }

  static factory = ({ id, userId, articleId, productId, content }) => {
    if (content !== undefined) {
      this.validateContentRule(content);
    }
    return new Comment({ id, userId, articleId, productId, content });
  };

  static validateContentRule = (content) => {
    if (content.length < 5) {
      throw new Exception("CONTENT_TOO_SHORT");
    }
  };

  get userId() {
    return this.#userId;
  }
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
