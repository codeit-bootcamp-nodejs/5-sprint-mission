import { PersistUserEntity } from "../../../domain/entity/user.entity";

export class RefreshTokensResDto {
  public accessToken;
  public refreshToken;

  constructor(accessToken: string, user: PersistUserEntity) {
    this.accessToken = accessToken;
    this.refreshToken = user.refreshToken ?? null;
  }
}