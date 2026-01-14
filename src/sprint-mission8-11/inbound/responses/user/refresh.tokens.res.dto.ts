import { PersistUserEntity } from "../../../application/command/entity/user.entity";

export class RefreshTokensResDto {
  public accessToken;
  public refreshToken;

  constructor(accessToken: string, user: PersistUserEntity) {
    this.accessToken = accessToken;
    this.refreshToken = user.refreshToken ?? null;
  }
}
