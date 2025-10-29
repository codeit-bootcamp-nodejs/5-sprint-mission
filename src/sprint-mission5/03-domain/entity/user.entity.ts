import { EXCEPTIONS } from "../../common/const/exception.info";
import { Exception } from "../../common/exception/exception";
import { BaseEntity, BaseParams } from "./base.entity";

export interface UserParams extends BaseParams<string> {
  email: string;
  nickname: string;
  image: string | undefined;
  password: string;
  refreshToken?: string | undefined;
}

export type UserFactory = {
  id?: string;
  email: string;
  nickname: string;
  image?: string;
  password: string;
  refreshToken?: string;
}

export class UserEntity extends BaseEntity<string> {
  private _email;
  private _nickname;
  private _image;
  private _password;
  private _refreshToken;

  constructor({
    id,
    email,
    nickname,
    image,
    password,
    refreshToken,
    createdAt = undefined,
    updatedAt = undefined,
  }: UserParams) {
    super({ id, createdAt, updatedAt });
    this._email = email;
    this._nickname = nickname;
    this._image = image;
    this._password = password;
    this._refreshToken = refreshToken;
  }

  static forCreate({
    id,
    email,
    nickname,
    image,
    password,
    refreshToken,
  }: UserFactory) {
    if (email) {
      this.validateEmailRule(email);
    }
    if (nickname) {
      this.validateEmailRule(nickname);
    }
    return new UserEntity({ id, email, nickname, image, password, refreshToken });
  }
  static validateEmailRule(email: string) {
    if (email.length < 1) {
      throw new Exception({info: EXCEPTIONS.EMAIL_TOO_SHORT});
    }
  }
  static validateNicknameRule(nickname: string) {
    if (nickname.length > 10) {
      throw new Exception({info: EXCEPTIONS.NICKNAME_TOO_LONG});
    }
  }
  get email() {
    return this._email;
  }
  get nickname() {
    return this._nickname;
  }
  get image() {
    return this._image;
  }
  get password() {
    return this._password;
  }
  get refreshToken() {
    return this._refreshToken;
  }
}
