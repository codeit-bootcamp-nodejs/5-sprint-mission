import { PersistedUserEntity } from "../../../03-domain/entity/user.entity";

export class SignInResDto {
  public id;
  public email;
  public image;
  public nickname;
  public accessToken;
  public refreshToken;
  constructor(accessToken: string, user: PersistedUserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.image = user.image;
    this.nickname = user.nickname;
    this.accessToken = accessToken;
    this.refreshToken = user.refreshToken;
  }
}
