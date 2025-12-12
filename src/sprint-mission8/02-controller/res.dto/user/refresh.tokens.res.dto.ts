import { PersistedUserEntity } from "../../../03-domain/entity/user.entity";

export class RefreshTokensResDto {
  public accessToken;
  public refreshToken;

  constructor({ accessToken, user }: {
    accessToken: string,
    user: PersistedUserEntity
  }) {
    this.accessToken = accessToken;
    this.refreshToken = user.refreshToken ?? null;
  }
}