import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class DeleteCommentReqValidator extends BaseValidator{
  constructor(data) {
    super(data)
  }

  validate() {
    const {id} = this.body;

    if(!this.isEmpty(id)) {
      if(!this.isInt(id)){
        throw new Exception("ID_FORM");
      }
    }

    return {
      id
    }
  }
}