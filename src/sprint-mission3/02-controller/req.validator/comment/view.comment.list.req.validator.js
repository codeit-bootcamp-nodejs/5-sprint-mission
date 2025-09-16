import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class ViewCommentListReqValidator extends BaseValidator{
  constructor(data){
    super(data);
  }

  validate() {
    let { cursor = 0, limit, sort = "recent"} = this.query;

    // if (!this.isString(targetType)) {
    //   throw new Exception("TARGETTYPE_FORM");
    // } else if(this.isEmpty(targetType)){
    //   throw new Exception("TARGETTYPE_NOT_EXSIST");
    // };

    cursor = Number(cursor);
    limit = Number(limit);
    
    if(!this.isInt(cursor)){
      throw new Exception("OFFSET_FORM");
    }
    if(!this.isInt(limit) || this.isEmpty(limit) || limit <= 0){
      throw new Exception("LIMIT_FORM");
    }

    if (!["recent", "commentAsc"].includes(sort)) {
      throw new Exception("SORT_FORM");
    }
    return {
      cursor,
      limit,
      sort
    }
  }
}