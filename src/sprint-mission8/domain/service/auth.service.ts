import { IAuthService } from "../../inbound/port/services/auth.service.interface";
import { SignInDto } from "../../inbound/requests/user/user.req.schemas";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Exception } from "../../shared/exception/exception";
import { PersistUserEntity } from "../entity/user.entity";
import { BaseService } from "./base.service";

export type AuthenticatedUserData = {
  accessToken: string;
  foundUser: PersistUserEntity
}

export class AuthService extends BaseService implements IAuthService {
  async signInUser(dto: SignInDto): Promise<AuthenticatedUserData> {
    const foundUser = await this._repos.user.findUserByEmail(dto.email);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    if (!(await foundUser.isPasswordMatch(dto.password, this._managers.hash))) {
      throw new Exception({ info: EXCEPTIONS.PASSWORD_MISMATCH });
    }

    const refreshToken = this._utils.token.generateRefreshToken({ userId: foundUser.id });

    foundUser.updateRefreshToken(refreshToken, this._managers.hash);
    await this._repos.user.update(foundUser);

    const accessToken = this._utils.token.generateAccessToken({ userId: foundUser.id });

    return { accessToken, foundUser };
  };

  async signOutUser(id: string): Promise<void> {
    const foundUser = await this._repos.user.findUserById(id);

    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    foundUser.deleteRefreshToken();
    await this._repos.user.update(foundUser);
  };

  async refreshTokens(refreshToken: string): Promise<AuthenticatedUserData> {
    const { userId } = this._utils.token.verifyToken(refreshToken);

    const foundUser =
      await this._repos.user.findUserById(userId);

    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    if (!(await foundUser.isRefreshTokenMatch(refreshToken, this._managers.hash))) {
      throw new Exception({ info: EXCEPTIONS.INVALID_AUTH });
    }

    const newRefreshToken = this._utils.token.generateRefreshToken({ userId });
    await foundUser.updateRefreshToken(newRefreshToken, this._managers.hash);
    await this._repos.user.update(foundUser);

    const newAccessToken = this._utils.token.generateAccessToken({ userId });

    return { accessToken: newAccessToken, foundUser };
  };
}
