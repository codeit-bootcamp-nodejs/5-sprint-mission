import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class ViewArticleReqValidator extends BaseValidator{
  constructor(data) {
    super(data);
  }

  validate = () => {
    const {title} = this.params;
    
    if(!this.isString(title) || this.isEmpty(title) || title.length > 20){
      throw new Exception("TITLE_FORM");
    }
    
    return {
      title
    }
  }

}