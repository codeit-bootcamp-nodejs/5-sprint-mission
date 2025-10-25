import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class CreateProductReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { name, description, price, tags } = this.body;

    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }

    if (!this.isString(name)) {
      throw new Exception("NAME_FORM");
    } else if (this.isEmpty(name)) {
      throw new Exception("NAME_NOT_EXSIST");
    }

    if (!this.isString(description)) {
      throw new Exception("DESCRIPTION_FORM");
    } else if (this.isEmpty(description)) {
      throw new Exception("DESCRIPTION_NOT_EXSIST");
    }

    if (!this.isInt(price)) {
      throw new Exception("PRICE_FORM");
    } else if (this.isEmpty(price)) {
      throw new Exception("PRICE_NOT_EXSIST");
    }

    if (!Array.isArray(tags) || !tags.every((el) => typeof el === "string")) {
      throw new Exception("TAGS_FORM");
    } else if (this.isEmpty(tags)) {
      throw new Exception("TAGS_NOT_EXSIST");
    }

    return { userId: this.userId, name, description, price, tags };
  }
}
