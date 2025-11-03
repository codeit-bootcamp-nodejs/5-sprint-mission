export interface ILoginResDto {
  accessToken: string;
  refreshToken: string;
}

export class LoginResDto {
  accessToken;
  refreshToken;

  constructor({ accessToken, refreshToken }: ILoginResDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
