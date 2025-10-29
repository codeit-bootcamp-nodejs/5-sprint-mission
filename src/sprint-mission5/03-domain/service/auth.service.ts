import { IRepos } from "../../04-repo/repos.js";
import { EXCEPTIONS } from "../../common/const/exception.info.js";
import { Exception } from "../../common/exception/exception.js";
import { IManagers } from "../../common/util/managers.js";
import { PersistedUserEntity } from "../entity/user.entity.js";
import { BaseService } from "./base.service.js";

export interface IAuthService {
  signInUser: ({ email, password }: {
    email: string;
    password: string;
  }) => Promise<{
    accessToken: string;
    authenticatedUser: PersistedUserEntity | null;
  }>;
  signOutUser: ({ id }: {
    id: string;
  }) => Promise<void>;
  generateTokens: (userId: string) => Promise<{
    accessToken: string;
    authenticatedUser: PersistedUserEntity | null;
  }>;
  refreshTokens: (refreshToken: string) => Promise<{
    accessToken: string;
    user: PersistedUserEntity | null;
  }>;
}
export class AuthService extends BaseService implements IAuthService{
  private _tokenManager;
  private _hashManager;

  constructor(repos: IRepos, managers: IManagers) {
    super(repos);
    this._tokenManager = managers.token;
    this._hashManager = managers.hash
  }

  signInUser = async ({ email, password }: {
    email: string;
    password: string;
  }) => {
    const user = await this._repos.user.findUserByEmail(email);
    if (!user) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXSIST });
    }
    const isPasswordMatch = await this._hashManager.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new Exception({ info: EXCEPTIONS.PASSWORD_MISMATCH });
    }
    const { accessToken, authenticatedUser } = await this.generateTokens(user.id);

    return { accessToken, authenticatedUser };
  };

  signOutUser = async ({ id }: { id: string; }) => {
    const foundUser = await this._repos.user.findUserByEmail(id);

    if (foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_EXIST });
    }

    const createdUser = await this._repos.user.DeleteRefreshToken(id, null);
  };

  //다 만료 시에는 로그인 페이지로 이동하게 프론트엔트 코드를 구현하면 될 것 같다
  generateTokens = async (userId: string) => {
    const { accessToken, refreshToken } = this._tokenManager.generate({
      userId,
    });
    const authenticatedUser = await this._repos.user.generate(
      userId,
      refreshToken,
    );
    return { accessToken, authenticatedUser };
  };

  refreshTokens = async (refreshToken: string) => {
    // 엑세스 만료 시
    const decoded = this._tokenManager.verify<{ userId: string }>(refreshToken);
    const foundUser =
      await this._repos.user.findUserByRefreshToken(refreshToken);

    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.REFRESHTOKEN_NOT_EXSIST });
    }

    if (foundUser.id !== decoded.userId) {
      throw new Exception({ info: EXCEPTIONS.REFRESHTOKEN_MISMATCH });
    }

    const { accessToken, refreshToken: updatedrefreshToken } =
      this._tokenManager.generate({
        userId: decoded.userId,
      });

    const user = await this._repos.user.generate(
      decoded.userId,
      updatedrefreshToken,
    );

    return { accessToken, user };
  };
}
