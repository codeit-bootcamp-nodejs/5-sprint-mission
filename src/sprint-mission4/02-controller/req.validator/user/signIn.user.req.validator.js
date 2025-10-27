import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class SignInUserReqValidator extends BaseValidator {
  email;
  password;

  constructor(data) {
    super(data);
  }

  validate() {
    const { email, password } = this.body;

    if (!this.isString(email) || this.isEmpty(email)) {
      throw new Exception("EMAIL_FORM");
    }
    if (!this.isString(password) || this.isEmpty(password)) {
      throw new Exception("PASSWORD_FORM");
    }

    return {
      email,
      password,
    };
  }
}
