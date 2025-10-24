import { Exception } from "../../common/const/exception.js";
import { BaseEntity } from "./baseEntity.js";

export class User extends BaseEntity {
  #email;
  #nickname;
  #image;
  #password;
  #refreshToken;

  constructor({
    id,
    email,
    nickname,
    image = undefined,
    password,
    refreshToken,
    createdAt = undefined,
    updatedAt = undefined,
  }) {
    super({ id, createdAt, updatedAt });
    this.#email = email;
    this.#nickname = nickname;
    this.#image = image;
    this.#password = password;
    this.#refreshToken = refreshToken;
  }

  static forCreate({ id = undefined, email, nickname, image, password, refreshToken }) {
    if (email) {
      this.validateEmailRule(email);
    }
    if (nickname) {
      this.validateEmailRule(nickname);
    }
    return new User({ id, email, nickname, image, password, refreshToken });
  }
  static validateEmailRule(email) {
    if (email.length < 1) {
      throw new Exception("EMAIL_TOO_SHORT");
    }
  }
  static validateNicknameRule(nickname) {
    if (nickname.length > 10) {
      throw new Exception("NICKNAME_TOO_LONG");
    }
  }
  get email() {
    return this.#email;
  }
  get nickname() {
    return this.#nickname;
  }
  get image() {
    return this.#image;
  }
  get password() {
    return this.#password;
  }
  get refreshToken() {
    return this.#refreshToken;
  }
}