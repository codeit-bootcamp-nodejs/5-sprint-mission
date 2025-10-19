import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class ViewArticleReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate = () => {
    const { id } = this.params;

    if (!this.isString(id) || this.isEmpty(id)) {
      throw new Exception("ID_FORM");
    }

    return {
      id,
    };
  };
}
