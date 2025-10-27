import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class GetArticleReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate = () => {
    const { articleId } = this.params;

    if (this.isEmpty(articleId)) {
      throw new Exception("ARTICLEID_FORM");
    }

    return {
      articleId,
    };
  };
}
