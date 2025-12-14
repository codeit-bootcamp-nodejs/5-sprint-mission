import { PersistUserEntity } from "../../../domain/entity/user.entity";

export class SignInResDto {
  public id;
  public email;
  public image;
  public nickname;
  public accessToken;
  public refreshToken;
  constructor(accessToken: string, user: PersistUserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.image = user.image;
    this.nickname = user.nickname;
    this.accessToken = accessToken;
    this.refreshToken = user.refreshToken;
  }
}
