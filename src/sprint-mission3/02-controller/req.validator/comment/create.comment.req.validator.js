import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class CreateCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { targetType, targetId, content } = this.body;
    if (!this.isString(targetType)) {
      throw new Exception("TARGETTYPE_FORM");
    } else if(this.isEmpty(targetType)){
      throw new Exception("TARGETTYPE_NOT_EXSIST");
    };

    if (!this.isString(content)) {
      throw new Exception("CONTENT_FORM");
    } else if(this.isEmpty(content)){
      throw new Exception("CONTENT_NOT_EXSIST");
    };

    return {targetType, targetId, content};
  }
}
