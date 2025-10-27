import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class CreateArticleCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { content } = this.body;
    const { articleId } = this.params;

    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }
    if (this.isEmpty(articleId)) {
      throw new Exception("ARTICLEID_FORM");
    }

    if (!this.isString(content)) {
      throw new Exception("CONTENT_FORM");
    } else if (this.isEmpty(content)) {
      throw new Exception("CONTENT_NOT_EXSIST");
    }

    return {
      userId: this.userId,
      articleId,
      content,
    };
  }
}
