import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class UpdateCommentReqValidator extends BaseValidator{
  constructor(data) {
    super(data);
  }

  validate() {
    let { id, content } = this.body;
  
    if (this.isEmpty(id)) {
      throw new Exception("ID_NOT_EXSIST")
    }

    if (!this.isEmpty(content)){
      if(!this.isString(content)){
        throw new Exception("CONTENT_FORM");  
      }
    }else if(this.isEmpty(content)){
      content = undefined;
    }

    return {
      id,
      content
    }
  }

}