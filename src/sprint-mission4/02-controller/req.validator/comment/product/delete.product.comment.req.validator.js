import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class DeleteProductCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { productId, id } = this.params;
    id = Number(id);

    if (!this.isEmpty(id)) {
      if (!this.isInt(id)) {
        throw new Exception("ID_FORM");
      }
    }

    return {
      id,
      productId
    };
  }
}
