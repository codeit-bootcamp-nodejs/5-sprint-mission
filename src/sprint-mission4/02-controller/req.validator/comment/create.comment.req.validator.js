import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class CreateCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { content } = this.body;
    const { targetId } = this.params;
    if (!this.isString(content)) {
      throw new Exception("CONTENT_FORM");
    } else if (this.isEmpty(content)) {
      throw new Exception("CONTENT_NOT_EXSIST");
    }

    return { targetId, content };
  }
}
