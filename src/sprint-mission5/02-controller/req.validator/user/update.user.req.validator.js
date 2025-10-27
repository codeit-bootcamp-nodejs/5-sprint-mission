import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class updateUserReqValidator extends BaseValidator {
  email;
  nickname;
  image;

  constructor(data) {
    super(data);
  }

  validate() {
    const { email, nickname, image } = this.body;

    if (!this.isEmpty(email)) {
      if (!this.isString(email)) {
        throw new Exception("EMAIL_FORM");
      }
    }
    if (!this.isEmpty(nickname)) {
      if (!this.isString(nickname)) {
        throw new Exception("NICKNAME_FORM");
      }
    }
    if (!this.isEmpty(image)) {
      if (!this.isString(image)) {
        throw new Exception("IMAGE_FORM");
      }
    }
    return {
      id: this.userId,
      email,
      nickname,
      image,
    };
  }
}
