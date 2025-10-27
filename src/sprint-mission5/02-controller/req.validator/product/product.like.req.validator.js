import { BaseValidator } from "../base.validator.js";

export class ProductLikeReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { productId } = this.params;

    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }
    if (this.isEmpty(productId)) {
      throw new Exception("PRODUCTID_FORM");
    }

    return {
      userId: this.userId,
      productId,
    };
  }
}
