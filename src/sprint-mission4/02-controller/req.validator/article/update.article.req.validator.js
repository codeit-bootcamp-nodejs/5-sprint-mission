import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class UpdateArticleReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { title, content } = this.body;
    const {id} = this.params;
    if (this.isEmpty(id)) {
      throw new Exception("ID_NOT_EXSIST");
    }

    if (!this.isEmpty(title)) {
      if (!this.isString(title)) {
        throw new Exception("TITLE_FORM");
      }
    } else if (this.isEmpty(title)) {
      title = undefined;
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
      title,
      content,
    };
  }
}
