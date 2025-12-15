import { BaseService } from "./base-service";
import { IRepository } from "../../outbound/repository";
import { create } from "superstruct";

import bcrypt from "bcrypt";
import { PersistedUserEntity } from "../entity/user-entity";
import { comparePassword } from "../../shared/bcrypt";
import { generateTokens, verifyRefreshToken } from "../../shared/jwt";
import { IAuthService } from "../port/service/auth-service";
import {
  LoginBodyStruct,
  RegisterBodyStruct,
} from "../../inbound/structs/auth-structs";
import BadRequestError from "../../shared/errors/BadRequestError";

export class AuthService extends BaseService implements IAuthService {
  constructor(repository: IRepository) {
    super(repository);
  }

  async signUp(inputData: {
    email: string;
    nickname: string;
    password: string;
  }) {
    const { email, nickname, password } = create(inputData, RegisterBodyStruct);

    const existingUser = await this.repository.base.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("이미 존재하는 계정입니다");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.repository.auth.registUser({
      email,
      nickname,
      hasedPassword: hashedPassword,
    });

    return newUser;
  }

  async login(inputData: { email: string; password: string }) {
    const { email, password } = create(inputData, LoginBodyStruct);
    const user = await this.repository.base.findUserByEmail(email);
    if (!user) {
      throw new BadRequestError("존재하지 않는 사용자입니다");
    }

    const isPasswordValid = await comparePassword(password, user.hasedPassword);
    if (!isPasswordValid) {
      throw new BadRequestError("비밀번호가 일치하지 않습니다");
    }

    const userId = user.id;
    if (!userId) {
      throw new BadRequestError("사용자 정보가 올바르지 않습니다");
    }

    const { accessToken, refreshToken } = generateTokens(userId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.auth.updateRefreshToken(
      userId,
      refreshToken,
      expiresAt,
    );

    return { user, accessToken, refreshToken };
  }

  async reissueTokens(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.userId;

    const user = await this.repository.auth.validateRefreshToken(
      userId,
      refreshToken,
    );

    if (!user) {
      throw new BadRequestError(
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
