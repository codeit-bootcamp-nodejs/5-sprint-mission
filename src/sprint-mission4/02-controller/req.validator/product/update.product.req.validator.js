import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class UpdateProductReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { name, description, price, tags } = this.body;
    const { productId } = this.params;
    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }
    if (this.isEmpty(productId)) {
      throw new Exception("PRODUCTID_FORM");
    }

    if (!this.isEmpty(name)) {
      if (!this.isString(name)) {
        throw new Exception("NAME_FORM");
      }
    } else if (this.isEmpty(name)) {
      name = undefined;
    }

    if (!this.isEmpty(description)) {
      if (!this.isString(description)) {
        throw new Exception("DESCRIPTION_FORM");
      }
    } else if (this.isEmpty(description)) {
      description = undefined;
    }

    if (!this.isEmpty(price)) {
      if (!this.isInt(price)) {
        throw new Exception("PRICE_FORM");
      }
    } else if (this.isEmpty(price)) {
      price = undefined;
    }

    if (!this.isEmpty(tags)) {
      if (!Array.isArray(tags) || !tags.every((el) => typeof el === "string")) {
        throw new Exception("TAGS_FORM");
      }
    } else if (this.isEmpty(tags)) {
      tags = undefined;
    }

    return {
      userId: this.userId,
      productId,
      name,
      description,
      price,
      tags,
    };
  }
}
