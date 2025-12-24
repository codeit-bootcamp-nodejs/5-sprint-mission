import { IAuthService } from "../../inbound/port/services/auth.service.interface";
import { SignInDto } from "../../inbound/requests/user/user.req.schemas";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Exception } from "../../shared/exception/exception";
import { ITokenUtil } from "../../shared/util/token.util";
import { PersistUserEntity } from "../entity/user.entity";
import { IHashManager } from "../port/managers/hash.manager.interface";
import { IUserRepo } from "../port/repo/user.repo.interface";

export type AuthenticatedUserData = {
  accessToken: string;
  foundUser: PersistUserEntity
}

export class AuthService implements IAuthService {
  constructor(
    private readonly _userRepo: IUserRepo,
    private readonly _hashManager: IHashManager,
    private readonly _tokenUtil: ITokenUtil
  ){}
  async signInUser(dto: SignInDto): Promise<AuthenticatedUserData> {
    const foundUser = await this._userRepo.findUserByEmail(dto.email);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    if (!(await foundUser.isPasswordMatch(dto.password, this._hashManager))) {
      throw new Exception({ info: EXCEPTIONS.PASSWORD_MISMATCH });
    }

    const refreshToken = this._tokenUtil.generateRefreshToken({ userId: foundUser.id });

    foundUser.updateRefreshToken(refreshToken, this._hashManager);
    await this._userRepo.update(foundUser);

    const accessToken = this._tokenUtil.generateAccessToken({ userId: foundUser.id });

    return { accessToken, foundUser };
  };

  async signOutUser(id: string): Promise<void> {
    const foundUser = await this._userRepo.findUserById(id);

    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    foundUser.deleteRefreshToken();
    await this._userRepo.update(foundUser);
  };

  async refreshTokens(refreshToken: string): Promise<AuthenticatedUserData> {
    const { userId } = this._tokenUtil.verifyToken(refreshToken);

    const foundUser =
      await this._userRepo.findUserById(userId);

    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    if (!(await foundUser.isRefreshTokenMatch(refreshToken, this._hashManager))) {
      throw new Exception({ info: EXCEPTIONS.INVALID_AUTH });
    }

    const newRefreshToken = this._tokenUtil.generateRefreshToken({ userId });
    await foundUser.updateRefreshToken(newRefreshToken, this._hashManager);
    await this._userRepo.update(foundUser);

    const newAccessToken = this._tokenUtil.generateAccessToken({ userId });

    return { accessToken: newAccessToken, foundUser };
  };
}
