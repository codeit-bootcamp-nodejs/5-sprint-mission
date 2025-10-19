import { Exception } from "../../common/exception.js";
import { BaseEntity } from "./baseEntity.js";

export class Comment extends BaseEntity {
  #targetId;
  #content;

  constructor({ id, targetId, content, createdAt, updatedAt }) {
    super({ id, createdAt, updatedAt });
    this.#content = content;
    this.#targetId = targetId;
  }

  static factory = ({ targetId, id, content }) => {
    if (content !== undefined) {
      this.validateContentRule(content);
    }
    return new Comment({ targetId, id, content });
  };

  static validateContentRule = (content) => {
    if (content.length < 5) {
      throw new Exception("CONTENT_TOO_SHORT");
    }
  };

  get content() {
    return this.#content;
  }
  get targetId() {
    return this.#targetId;
  }
}
