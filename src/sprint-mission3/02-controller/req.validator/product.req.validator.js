import { Exception } from "../../common/exception.js";
import { BaseValidator } from "./base.validator.js";

export class ProductReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { name, description, price, tags } = this.body;

    if (!this.isString(name) || this.isEmpty(name)) {
      throw new Exception("NAME_FORM");
    }

    if (!this.isString(description) || this.isEmpty(description)) {
      throw new Exception("DESCRIPTION_FORM");
    }

    if (!this.isInt(price) || this.isEmpty(price)) {
      throw new Exception("PRICE_FORM");
    }

    if (
      this.isEmpty(tags) ||
      !Array.isArray(tags) ||
      !tags.every((el) => typeof el === "string")
    ) {
      throw new Exception("TAGS_FORM");
    }

    return {name, description, price, tags};
  }
}
