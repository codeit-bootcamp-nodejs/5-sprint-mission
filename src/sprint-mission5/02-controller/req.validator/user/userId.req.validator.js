import { BaseValidator } from "../base.validator.js";

export class UserIdReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }

    return {
      id: this.userId,
    };
  }
}
