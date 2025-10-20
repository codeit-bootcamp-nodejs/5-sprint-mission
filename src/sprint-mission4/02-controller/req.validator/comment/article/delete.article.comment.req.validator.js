
import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class DeleteArticleCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { articleId, id } = this.params;
    id = Number(id);

    if (!this.isEmpty(id)) {
      if (!this.isInt(id)) {
        throw new Exception("ID_FORM");
      }
    }

    return {
      id,
      articleId
    };
  }
}
