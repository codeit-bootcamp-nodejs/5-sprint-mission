import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class DeleteProductReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { name } = this.body;
    const { id } = this.params;
    if (this.isEmpty(id) && this.isEmpty(name)) {
      throw new Exception("AT_LEAST_ONE_FORM");
    }

    if (!this.isEmpty(id)) {
      if (!this.isString(id)) {
        throw new Exception("ID_FORM");
      }
    }
    if (!this.isEmpty(name)) {
      if (!this.isString(name)) {
        throw new Exception("NAME_FORM");
      }
    }

    return {
      id,
      name,
    };
  }
}
