import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class UpdatePasswordReqValidator extends BaseValidator {
  password;

  constructor(data) {
    super(data);
  }

  validate() {
    const { password, updatePassword } = this.body;

    if (!this.isString(password) || this.isEmpty(password)) {
      throw new Exception("PASSWORD_FORM");
    }
    if (!this.isString(updatePassword) || this.isEmpty(updatePassword)) {
      throw new Exception("UPDATEPASSWORD_FORM");
    }
    return {
      id: this.userId,
      password,
      updatePassword,
    };
  }
}
