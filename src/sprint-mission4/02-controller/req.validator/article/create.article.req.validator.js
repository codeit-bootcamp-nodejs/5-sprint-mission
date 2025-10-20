import { Exception, EXCEPTIONS} from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class CreateArticleReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { title, content } = this.body;

    if (!this.isString(title)) {
      throw new Exception(EXCEPTIONS.TITLE_FORM);
    } else if (this.isEmpty(title)) {
      throw new Exception("TITLE_NOT_EXSIST");
    }

    if (!this.isString(content)) {
      throw new Exception("CONTENT_FORM");
    } else if (this.isEmpty(content)) {
      throw new Exception("CONTENT_NOT_EXSIST");
    }

    return { title, content };
  }
}
