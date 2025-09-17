import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class ViewProductReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate = () => {
    const { name } = this.params;
    if (!this.isString(name) || this.isEmpty(name) || name.length > 20) {
      throw new Exception("NAME_FORM");
    }

    return {
      name,
    };
  };
}
