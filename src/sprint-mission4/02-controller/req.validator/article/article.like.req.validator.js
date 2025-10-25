import { BaseValidator } from "../base.validator.js";

export class ArticleLikeReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { articleId } = this.params;

    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }
    if (this.isEmpty(articleId)) {
      throw new Exception("ARTICLEID_FORM");
    }

    return {
      userId: this.userId,
      articleId,
    };
  }
}
