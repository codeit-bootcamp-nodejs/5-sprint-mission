import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class UpdateProductReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { name, description, price, tags } = this.body;
    const { id } = this.params;
    if (this.isEmpty(id)) {
      throw new Exception("ID_NOT_EXSIST");
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
      id,
      name,
      description,
      price,
      tags,
    };
  }
}
