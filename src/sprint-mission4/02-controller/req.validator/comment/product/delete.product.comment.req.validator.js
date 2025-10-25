import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class DeleteProductCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { productId } = this.params;
    let { commentId } = this.params;
    commentId = Number(commentId);

    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }
    if (this.isEmpty(productId)) {
      throw new Exception("PRODUCTID_FORM");
    }
    if (this.isEmpty(commentId)) {
      throw new Exception("COMMENTID_FORM");
    }

    return {
      userId: this.userId,
      productId,
      commentId,
    };
  }
}
