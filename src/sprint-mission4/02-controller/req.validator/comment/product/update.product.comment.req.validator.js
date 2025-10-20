import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class UpdateProductCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { content } = this.body;
    let { productId, id } = this.params;
    id = Number(id);
    if (this.isEmpty(id)) {
      throw new Exception("ID_NOT_EXSIST");
    }

    if (!this.isEmpty(content)) {
      if (!this.isString(content)) {
        throw new Exception("CONTENT_FORM");
      }
    } else if (this.isEmpty(content)) {
      content = undefined;
    }

    return {
      id,
      content,
      productId
    };
  }
}
