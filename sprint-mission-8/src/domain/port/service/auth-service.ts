import { PersistedUserEntity } from "../../entity/user-entity";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface IAuthService {
  signUp: (data: {
    email: string;
    nickname: string;
    password: string;
  }) => Promise<PersistedUserEntity>;
  login: (inputData: {
    email: string;
    password: string;
  }) => Promise<AuthTokens>;
  reissueTokens: (refreshToken: string) => Promise<AuthTokens>;
}
