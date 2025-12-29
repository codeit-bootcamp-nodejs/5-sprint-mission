import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repo/user.repository";
import { HttpError } from "../middlewares/error.handler";
import { SignUpDto, LoginDto, TokenDto } from "../dto/auth.dto";
import { User } from "@prisma/client";

interface AuthPayload {
  userId: number;
}

export class AuthService {
  private userRepository;

  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly REFRESH_TOKEN_SECRET: string;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;

    const accessSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET_KEY;

    if (!accessSecret || !refreshSecret) {
      throw new Error("JWT 시크릿 키가 .env 파일에 설정되지 않았습니다.");
    }
    this.ACCESS_TOKEN_SECRET = accessSecret;
    this.REFRESH_TOKEN_SECRET = refreshSecret;
  }

  private createAccessToken(userId: number): string {
    return jwt.sign({ userId }, this.ACCESS_TOKEN_SECRET, {
      expiresIn: "12h",
    });
  }

  private createRefreshToken(userId: number): string {
    return jwt.sign({ userId }, this.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  }

  async signUp(
    data: SignUpDto,
  ): Promise<Omit<User, "password" | "refreshToken">> {
    const existingUserByEmail = await this.userRepository.findUserByEmail(
      data.email,
    );
    if (existingUserByEmail) {
      throw new HttpError(409, "이미 사용중인 이메일입니다.");
    }

    const existingUserByNickname = await this.userRepository.findUserByNickname(
      data.nickname,
    );
    if (existingUserByNickname) {
      throw new HttpError(409, "이미 사용중인 닉네임입니다.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser(data, hashedPassword);

    const { password, refreshToken, ...rest } = user;
    return rest;
  }

  async login(data: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findUserByEmail(data.email);
    if (!user) {
      throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    await this.userRepository.updateUserRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(tokenDto: TokenDto): Promise<{ accessToken: string }> {
    const { refreshToken } = tokenDto;

    let payload: AuthPayload;
    try {
      const decoded = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET);
      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        typeof decoded.userId === "number"
      ) {
        payload = decoded as AuthPayload;
      } else {
        throw new Error("유효하지 않은 토큰 페이로드입니다.");
      }
    } catch (error) {
      throw new HttpError(401, "Refresh Token이 유효하지 않습니다.");
    }

    const userId = payload.userId;
    const user = await this.userRepository.findUserById(userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new HttpError(401, "Refresh Token이 일치하지 않습니다.");
    }

    const newAccessToken = this.createAccessToken(userId);
    return { accessToken: newAccessToken };
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.updateUserRefreshToken(userId, null);
  }
}
