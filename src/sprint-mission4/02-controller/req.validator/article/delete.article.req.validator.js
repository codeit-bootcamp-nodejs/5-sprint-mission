import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class DeleteArticleReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { title } = this.body;
    const { id } = this.params;
    if (this.isEmpty(id) && this.isEmpty(title)) {
      throw new Exception("AT_LEAST_ONE_FORM");
    }

    if (!this.isEmpty(id)) {
      if (!this.isString(id)) {
        throw new Exception("ID_FORM");
      }
    }
    if (!this.isEmpty(title)) {
      if (!this.isString(title)) {
        throw new Exception("TITLE_FORM");
      }
    }

    return {
      id,
      title,
    };
  }
}
