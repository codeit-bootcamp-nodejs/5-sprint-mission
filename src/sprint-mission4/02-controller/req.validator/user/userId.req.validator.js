import { BaseValidator } from "../base.validator.js";

export class UserIdReqValidator extends BaseValidator {
  
  constructor(data) {
    super(data);
  }

  validate() {

    return {
      id : this.userId
    }
  }
}