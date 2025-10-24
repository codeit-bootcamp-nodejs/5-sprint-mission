import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class SignUpUserReqValidator extends BaseValidator {
  email;
  nickname;
  image;
  password;

  constructor(data) {
    super(data);
  }

  validate() {
    const { email, nickname, image = undefined, password } = this.body

    if (!this.isString(email) || this.isEmpty(email)) {
      throw new Exception("EMAIL_FORM");
    }
    if (!this.isString(nickname) || this.isEmpty(nickname)) {
      throw new Exception("NICKNAME_FORM");
    }
    if (!this.isEmpty(image)) {
      if (!this.isString(image)) {
        throw new Exception("IMAGE_FORM");
      }
    }
    if (!this.isString(password) || this.isEmpty(password) || password.length < 4) {
      throw new Exception("PASSWORD_FORM");
    }

    return {
      email,
      nickname,
      image,
      password
    }
  }
}