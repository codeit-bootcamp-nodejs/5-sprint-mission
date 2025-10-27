import { UserRepository } from "../repositories/user-repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export class AuthService {
  constructor(prisma) {
    this.userRepository = new UserRepository(prisma);
  }

  async signUp({ email, password, nickname }) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("이미 존재하는 계정입니다");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
    });

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    await this.userRepository.updateRefreshToken(newUser.id, refreshToken);

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("존재하지 않는 사용자입니다");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("비밀번호가 일치하지 않습니다");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findUserByRefreshToken(refreshToken);
    if (!user || user.id !== decoded.userId) {
      throw new Error("유효하지 않은 리프레시 토큰입니다");
    }

    const newAccessToken = generateAccessToken(user.id);

    return {
      accessToken: newAccessToken,
    };
  }
}
