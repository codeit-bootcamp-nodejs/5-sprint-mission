import { PersistUserEntity } from "../../../domain/entity/user.entity";

export class UserResDto {
  public id;
  public email;
  public image;
  public nickname;
  public refreshToken;

  constructor(user: PersistUserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.image = user.image;
    this.nickname = user.nickname;
    this.refreshToken = user.refreshToken;
  }
}
