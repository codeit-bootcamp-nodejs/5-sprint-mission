export class RefreshTokensResDto {
  accessToken;
  refreshToken;

  constructor({ accessToken, user }) {
    this.accessToken = accessToken;
    this.refreshToken = user.refreshToken ?? null;
  }
}
