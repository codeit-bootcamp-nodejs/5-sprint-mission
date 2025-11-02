import { BaseService } from "./base-service";
import { IRepository } from "../../repositories/repository";
import { SignUpDto } from "../../dto/user/signup-user.dto";
import { LoginDto } from "../../dto/user/login-user.dto";
import { create } from "superstruct";
import {
  LoginBodyStruct,
  RegisterBodyStruct,
} from "../../lib/struct/authStructs";
import bcrypt from "bcrypt";
import { PersistedUserEntity } from "../entity/user-entity";
import { comparePassword } from "../../lib/bcrypt";
import { generateTokens, verifyRefreshToken } from "../../lib/jwt";
import { LoginResDto } from "../../dto/login-res.dto";

export interface IAuthService {
  signUp: (data: SignUpDto) => Promise<PersistedUserEntity>;
  login: (inputData: LoginDto) => Promise<LoginResDto>;
  // logout: (inputData: LoginDto) =>
  reissueTokens: (refreshToken: string) => Promise<LoginResDto>;
}

export class AuthService extends BaseService implements IAuthService {
  constructor(repository: IRepository) {
    super(repository);
  }

  async signUp(inputData: SignUpDto) {
    const { email, nickname, password } = create(inputData, RegisterBodyStruct);

    const existingUser = await this.repository.base.findUserByEmail(email);
    if (existingUser) {
      throw new Error("이미 존재하는 계정입니다");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.repository.auth.registUser({
      email,
      nickname,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(inputData: LoginDto) {
    const { email, password } = create(inputData, LoginBodyStruct);
    const user = await this.repository.base.findUserByEmail(email);
    if (!user) {
      throw new Error("존재하지 않는 사용자입니다");
    }

    const isPasswordValid = await comparePassword(password, user.hasedPassword);
    if (!isPasswordValid) {
      throw new Error("비밀번호가 일치하지 않습니다");
    }
    const { accessToken, refreshToken } = generateTokens(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.auth.updateRefreshToken(
      user.id,
      refreshToken,
      expiresAt,
    );

    return { accessToken, refreshToken };
  }

  // async logout() {}

  async reissueTokens(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.userId;

    const user = await this.repository.auth.validateRefreshToken(
      userId,
      refreshToken,
    );

    if (!user) {
      throw new Error(
        "토큰이 만료되었거나 유효하지 않습니다. 재로그인해주세요",
      );
    }

    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(userId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.auth.updateRefreshToken(
      user.id,
      newRefreshToken,
      expiresAt,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }
}
